const Employedb = require("../models/employe.model");
const Roledb = require("../models/role.model");
const Userdb = require("../models/user.model");
const controllerName = "employe.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");
const bcrypt = require("bcrypt");
const UserTokendb = require("../models/userToken.model");

exports.getEmploye = (req, res) => {
  const functionName = "getEmploye";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Employedb.findById(id)
      .populate({ path: "user", populate: { path: "role" } })
      .populate("listeTachesEffectuees")
      .then((data) => {
        sendSuccessResponse(res, data, controllerName, functionName);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.getListeEmploye = (req, res) => {
  const functionName = "getListeEmploye";
  try {
    Employedb.find({})
      .populate({ path: "user", populate: { path: "role" } })
      .populate("listeTachesEffectuees")
      .then((data) => {
        sendSuccessResponse(res, data, controllerName, functionName);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.addEmploye = async (req, res) => {
  const functionName = "addEmploye";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { nomEmploye, prenomEmploye, email, password, confirmPassword } =
      req.body;

    verifyArgumentExistence(
      ["nomEmploye", "prenomEmploye", "email", "password", "confirmPassword"],
      req.body
    );

    if ((password && !confirmPassword) || (!password && confirmPassword)) {
      throw new Error("Veillez remplir les champs de mot de passe");
    }
    if (confirmPassword && confirmPassword !== password) {
      throw new Error("Les mots de passes ne correspondent pas");
    }

    let role = await Roledb.findOne({ nomRole: "Employe" });
    if(!role){
      await (new Roledb({ nomRole: "Employe" })).save();
      role = await Roledb.findOne({ nomRole: "Employe" });
    }

    const newDataUser = {
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: new ObjectId(role._id),
    };

    const dataUserToInsert = new Userdb(newDataUser);
    dataUserToInsert
      .save({ session })
      .then((newUser) => {
        const newData = {
          nomEmploye: nomEmploye,
          prenomEmploye: prenomEmploye,
          user: new ObjectId(newUser._id),
        };

        const dataToInsert = new Employedb(newData);
        dataToInsert
          .save({ session })
          .then(async (data) => {
            sendSuccessResponse(
              res,
              data,
              controllerName,
              functionName,
              session
            );
          })
          .catch((err) => {
            sendErrorResponse(res, err, controllerName, functionName, session);
          });
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.updateEmploye = async (req, res) => {
  const functionName = "updateEmploye";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { nomEmploye, prenomEmploye, user } = req.body;

    verifyArgumentExistence(["id"], req.params);
    verifyArgumentExistence(["nomEmploye", "prenomEmploye", "user"], req.body);

    const newData = {
      nomEmploye: nomEmploye,
      prenomEmploye: prenomEmploye,
      user: new ObjectId(user),
    };

    Employedb.findByIdAndUpdate(new ObjectId(id), newData, {
      session,
    })
      .then(async (data) => {
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.deleteEmploye = async (req, res) => {
  const functionName = "deleteEmploye";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Employedb.findByIdAndDelete(new ObjectId(id), { session })
      .then(async (data) => {
        await Userdb.deleteOne({ _id: new ObjectId(data.user) }, { session });
        await UserTokendb.deleteMany({ user: new ObjectId(data.user) }, { session });
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};
