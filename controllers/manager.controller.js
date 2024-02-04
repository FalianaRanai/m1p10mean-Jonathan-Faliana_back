const Managerdb = require("../models/manager.model");
const Roledb = require("../models/role.model");
const Userdb = require("../models/user.model");
const UserTokendb = require("../models/userToken.model");
const controllerName = "manager.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");
const bcrypt = require("bcrypt");
const writeFile = require("@utils/writeFile.util");
const deleteFile = require("@utils/deleteFile.util");

exports.getManager = (req, res) => {
  const functionName = "getManager";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Managerdb.findById(id)
      .populate({ path: "user", populate: { path: "role" } })
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

exports.getListeManager = (req, res) => {
  const functionName = "getListeManager";
  try {
    Managerdb.find({})
      .populate({ path: "user", populate: { path: "role" } })
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

exports.addManager = async (req, res) => {
  const functionName = "addManager";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { nomManager, prenomManager, email, password, confirmPassword } =
      req.body;

    verifyArgumentExistence(
      ["nomManager", "prenomManager", "email", "password", "confirmPassword"],
      req.body
    );

    if ((password && !confirmPassword) || (!password && confirmPassword)) {
      throw new Error("Veillez remplir les champs de mot de passe");
    }
    if (confirmPassword && confirmPassword !== password) {
      throw new Error("Les mots de passes ne correspondent pas");
    }

    let role = await Roledb.findOne({ nomRole: "Manager" });
    if (!role) {
      await new Roledb({ nomRole: "Manager" }).save();
      role = await Roledb.findOne({ nomRole: "Manager" });
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
        let nomFichier = writeFile(req, "Manager");
        const newData = {
          nomManager: nomManager,
          prenomManager: prenomManager,
          user: new ObjectId(newUser._id),
          image: nomFichier ? nomFichier : undefined,
        };

        const dataToInsert = new Managerdb(newData);
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

exports.updateManager = async (req, res) => {
  const functionName = "updateManager";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { nomManager, prenomManager, user } = req.body;

    verifyArgumentExistence(["id"], req.params);
    verifyArgumentExistence(["nomManager", "prenomManager", "user"], req.body);

    let nomFichier = writeFile(req, "Manager");
    const newData = {
      nomManager: nomManager,
      prenomManager: prenomManager,
      user: new ObjectId(user),
      image: nomFichier ? nomFichier : undefined,
    };

    Managerdb.findByIdAndUpdate(new ObjectId(id), newData, {
      session,
    })
      .then(async (data) => {
        if (nomFichier && data.image != "default.webp") {
          deleteFile({
            repository: "Manager",
            data: data,
            res: res,
            session: session,
            controllerName: controllerName,
            functionName: functionName,
          });
        } else {
          sendSuccessResponse(res, data, controllerName, functionName, session);
        }
        // sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.deleteManager = async (req, res) => {
  const functionName = "deleteManager";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Managerdb.findByIdAndDelete(new ObjectId(id), { session })
      .then(async (data) => {
        await Userdb.deleteOne({ _id: new ObjectId(data.user) }, { session });
        await UserTokendb.deleteMany(
          { user: new ObjectId(data.user) },
          { session }
        );
        if (data.image!="default.webp") {
          deleteFile({
            repository: "Manager",
            res: res,
            data: data,
            controllerName: controllerName,
            functionName: functionName,
            session: session,
          });
        } else {
          sendSuccessResponse(res, data, controllerName, functionName, session);
        }
        // sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};
