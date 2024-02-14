const HoraireTravaildb = require("../models/horaireTravail.model");
const controllerName = "horaireTravail.controller";
const mongoose = require("mongoose");
const Userdb = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getHoraireTravail = (req, res) => {
  const functionName = "getHoraireTravail";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    HoraireTravaildb.find({_id: id, isDeleted: false})
      .then((data) => {
        sendSuccessResponse(res, data ? data[0] : null, controllerName, functionName);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.getListeHoraireTravail = (req, res) => {
  const functionName = "getListeHoraireTravail";
  try {
    HoraireTravaildb.find({ isDeleted: false })
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

exports.addHoraireTravail = async (req, res) => {
  const functionName = "addHoraireTravail"
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { nomHoraireTravail } = req.body;
    verifyArgumentExistence(["nomHoraireTravail"], req.body);

    const newData = {
      nomHoraireTravail: nomHoraireTravail,
    };

    const dataToInsert = new HoraireTravaildb(newData);
    dataToInsert
      .save({ session })
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

exports.updateHoraireTravail = async (req, res) => {
  const functionName = "updateHoraireTravail";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // console.log("params", req.params, "body", req.body);
    const { id } = req.params;
    const { nomHoraireTravail } = req.body;

    
    verifyArgumentExistence(["nomHoraireTravail"], req.body);
    verifyArgumentExistence(["id"], req.params);

    const newData = {
      nomHoraireTravail: nomHoraireTravail,
    };
    HoraireTravaildb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteHoraireTravail = async (req, res) => {
  const functionName = "deleteHoraireTravail";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    HoraireTravaildb.findByIdAndUpdate(new ObjectId(id), { isDeleted: true },{ session })
      .then(async (data) => {
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.getHoraireTravailEnCours = async (req, res) =>{
  const functionName = "getHoraireTravailEnCours";
  try {

    HoraireTravaildb.find({nomHoraireTravail: "en cours", isDeleted: false})
      .then(async (data) => {

        let horaireTravailEncours = data ? data[0] : null;
        if(!horaireTravailEncours){
          await (new HoraireTravaildb({ nomHoraireTravail: "en cours" })).save();
          horaireTravailEncours = await HoraireTravaildb.findOne({ nomHoraireTravail: "en cours", isDeleted: false });
        }

        sendSuccessResponse(res, horaireTravailEncours, controllerName, functionName);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
}
