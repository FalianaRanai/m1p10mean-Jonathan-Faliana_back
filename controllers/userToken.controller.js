const UserTokendb = require("../models/userToken.model");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const controllerName = "userToken.controller";
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getUserToken = (req, res) => {
  const functionName = "getUserToken";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    UserTokendb.find({_id: id, isDeleted: false})
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

exports.getListeUserToken = (req, res) => {
  const functionName = "getListeUserToken";
  try {
    UserTokendb.find({ isDeleted: false })
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

exports.addUserToken = async (req, res) => {
  const functionName = "addUserToken";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user, token } = req.body;
    verifyArgumentExistence(["user", "token"], req.body);

    let expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 3);

    const newData = {
      user: user,
      token: token,
      expired_at: expired_at,
    };

    const dataToInsert = new UserTokendb(newData);
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

exports.updateUserToken = async (req, res) => {
  const functionName = "updateUserToken";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    const { user, token, expired_at } = req.body;
    verifyArgumentExistence(["user", "token", "expired_at"], req.body);
    const newData = {
      user: user,
      token: token,
      expired_at: expired_at,
    };

    const {id} = req.params;
    verifyArgumentExistence(["id"], req.params);

    UserTokendb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteUserToken = async (req, res) => {
  const functionName = "deleteUserToken";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    UserTokendb.findByIdAndUpdate(new ObjectId(id), { isDeleted: true }, { session })
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
