const Tacheeffectueedb = require("../models/tacheeffectuee.model");
const controllerName = "tacheeffectuee.controller";
const mongoose = require("mongoose");
const Employedb = require("../models/employe.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getTacheeffectuee = (req, res) => {
  const functionName = "getTacheeffectuee";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Tacheeffectueedb.findById(id)
      .populate({
        path: "employe",
        populate: { path: "user", populate: { path: "role" } },
      })
      .populate("service")
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

exports.getListeTacheeffectuee = (req, res) => {
  const functionName = "getListeTacheeffectuee";
  try {
    Tacheeffectueedb.find({})
      .populate({
        path: "employe",
        populate: { path: "user", populate: { path: "role" } },
      })
      .populate("service")
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

exports.addTacheeffectuee = async (req, res) => {
  const functionName = "addTacheeffectuee";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { dateTache, employe, service } = req.body;
    verifyArgumentExistence(["dateTache", "employe", "service"], req.body);

    const newData = {
      dateTache: dateTache,
      employe: new ObjectId(employe),
      service: new ObjectId(service),
    }

    const dataToInsert = new Tacheeffectueedb(newData);
    dataToInsert
      .save({ session })
      .then(async (data) => {

        await Employedb.updateOne({ _id: data.employe  }, { $push: { listeTachesEffectuees: data._id } });
        sendSuccessResponse(res, data, controllerName, functionName, session);

      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.updateTacheeffectuee = async (req, res) => {
  const functionName = "updateTacheeffectuee";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // console.log("params", req.params, "body", req.body);
    const { id } = req.params;
    const { dateTache, employe, service } = req.body;

    verifyArgumentExistence(["dateTache", "employe", "service"], req.body);
    verifyArgumentExistence(["id"], req.params);

    const newData = {
      dateTache: dateTache,
      employe: new ObjectId(employe),
      service: new ObjectId(service),
    };

    Tacheeffectueedb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteTacheeffectuee = async (req, res) => {
  const functionName = "deleteTacheeffectuee";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    Tacheeffectueedb.findByIdAndDelete(new ObjectId(id), { session })
      .then(async (data) => {

        await Employedb.updateOne({ _id: data.employe  }, { $pull: { listeTachesEffectuees: data._id } });
        sendSuccessResponse(res, data, controllerName, functionName, session);

      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};
