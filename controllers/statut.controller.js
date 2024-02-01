const Statutdb = require("../models/statut.model");
const controllerName = "statut.controller";
const mongoose = require("mongoose");
const Userdb = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getStatut = (req, res) => {
  const functionName = "getStatut";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Statutdb.findById(id)
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

exports.getListeStatut = (req, res) => {
  const functionName = "getListeStatut";
  try {
    Statutdb.find({})
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

exports.addStatut = async (req, res) => {
  const functionName = "addStatut"
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { nomStatut } = req.body;
    verifyArgumentExistence(["nomStatut"], req.body);

    const newData = {
      nomStatut: nomStatut,
    };

    const dataToInsert = new Statutdb(newData);
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

exports.updateStatut = async (req, res) => {
  const functionName = "updateStatut";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // console.log("params", req.params, "body", req.body);
    const { id } = req.params;
    const { nomStatut } = req.body;

    
    verifyArgumentExistence(["nomStatut"], req.body);
    verifyArgumentExistence(["id"], req.params);

    const newData = {
      nomStatut: nomStatut,
    };
    Statutdb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteStatut = async (req, res) => {
  const functionName = "deleteStatut";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    Statutdb.findByIdAndDelete(new ObjectId(id), { session })
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
