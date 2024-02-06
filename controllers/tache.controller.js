const Tachedb = require("../models/tache.model");
const controllerName = "tache.controller";
const mongoose = require("mongoose");
const Employedb = require("../models/employe.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getTache = (req, res) => {
  const functionName = "getTache";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Tachedb.findById(id)
      .populate({
        path: "employe",
        populate: { path: "user", populate: { path: "role" } },
      })
      .populate("service")
      .populate("statut")
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

exports.getListeTache = (req, res) => {
  const functionName = "getListeTache";
  try {
    Tachedb.find({})
      .populate({
        path: "employe",
        populate: { path: "user", populate: { path: "role" } },
      })
      .populate("service")
      .populate("statut")
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

exports.addTache = async (req, res) => {
  const functionName = "addTache";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { dateDebut, dateFin, employe, service, statut } = req.body;
    verifyArgumentExistence(["dateDebut","dateFin",  "employe", "service", "statut"], req.body);

    const newData = {
      dateDebut: dateDebut,
      dateFin: dateFin,
      employe: new ObjectId(employe),
      service: new ObjectId(service),
      statut: new ObjectId(statut),
    }

    const dataToInsert = new Tachedb(newData);
    dataToInsert
      .save({ session })
      .then(async (data) => {

        await Employedb.updateOne({ _id: data.employe  }, { $push: { listeTaches: data._id } });
        sendSuccessResponse(res, data, controllerName, functionName, session);

      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.updateTache = async (req, res) => {
  const functionName = "updateTache";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // console.log("params", req.params, "body", req.body);
    const { id } = req.params;
    const { dateDebut, dateFin, employe, service, statut } = req.body;

    verifyArgumentExistence(["dateDebut", "dateFin", "employe", "service", "statut"], req.body);
    verifyArgumentExistence(["id"], req.params);

    const newData = {
      dateDebut: dateDebut,
      dateFin: dateFin,
      employe: new ObjectId(employe),
      service: new ObjectId(service),
      statut: new ObjectId(statut),
    };

    Tachedb.findByIdAndUpdate(new ObjectId(id), newData, {
      session,
    })
      .then(async (data) => {

        await Employedb.findByIdAndUpdate({ _id: data.employe  }, { $pull: { listeTaches: data._id } }, { session });
        await Employedb.findByIdAndUpdate({ _id: newData.employe  }, { $push: { listeTaches: data._id } }, { session });
        sendSuccessResponse(res, data, controllerName, functionName, session);

      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.deleteTache = async (req, res) => {
  const functionName = "deleteTache";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    Tachedb.findByIdAndDelete(new ObjectId(id), { session })
      .then(async (data) => {

        await Employedb.updateOne({ _id: data.employe  }, { $pull: { listeTaches: data._id } });
        sendSuccessResponse(res, data, controllerName, functionName, session);

      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};
