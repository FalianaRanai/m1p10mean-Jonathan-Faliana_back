const Roledb = require("../models/role.model");
const controllerName = "role.controller";
const mongoose = require("mongoose");
const Userdb = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getRole = (req, res) => {
  const functionName = "getRole";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Roledb.find({_id: id, isDeleted: false})
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

exports.getListeRole = (req, res) => {
  const functionName = "getListeRole";
  try {
    Roledb.find({ idDeleted: false })
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

exports.addRole = async (req, res) => {
  const functionName = "addRole"
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { nomRole } = req.body;
    verifyArgumentExistence(["nomRole"], req.body);

    const newData = {
      nomRole: nomRole,
    };

    const dataToInsert = new Roledb(newData);
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

exports.updateRole = async (req, res) => {
  const functionName = "updateRole";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // console.log("params", req.params, "body", req.body);
    const { id } = req.params;
    const { nomRole } = req.body;

    
    verifyArgumentExistence(["nomRole"], req.body);
    verifyArgumentExistence(["id"], req.params);

    const newData = {
      nomRole: nomRole,
    };
    Roledb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteRole = async (req, res) => {
  const functionName = "deleteRole";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    Roledb.findByIdAndUpdate(new ObjectId(id), { isDeleted: true }, { session })
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
