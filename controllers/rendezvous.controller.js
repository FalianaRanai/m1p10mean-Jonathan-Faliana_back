const Rendezvousdb = require("../models/rendezvous.model");
const controllerName = "rendezvous.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getRendezvous = (req, res) => {
  const functionName = "getRendezvous";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Rendezvousdb.findById(id)
      .populate("client")
      .populate("employe")
      .populate("listeServices")
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

exports.getListeRendezvous = (req, res) => {
  const functionName = "getListeRendezvous";
  try {
    Rendezvousdb.find({})
      .populate("client")
      .populate("employe")
      .populate("listeServices")
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

exports.addRendezvous = async (req, res) => {
  const functionName = "addRendezvous";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { client, employe, dateRdv, listeServices, statut } = req.body;

    verifyArgumentExistence(
      ["client", "employe", "dateRdv", "listeServices", "statut"],
      req.body
    );

    const newData = {
      client: client,
      employe: employe,
      dateRdv: dateRdv,
      listeServices: listeServices.map((service) => {
        return new ObjectId(service);
      }),
      statut: statut,
    };

    const dataToInsert = new Rendezvousdb(newData);
    dataToInsert
      .save({ session })
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

exports.updateRendezvous = async (req, res) => {
  const functionName = "updateRendezvous";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { client, employe, dateRdv, listeServices, statut } = req.body;

    verifyArgumentExistence(["id"], req.params);
    verifyArgumentExistence(
      ["client", "employe", "dateRdv", "listeServices", "statut"],
      req.body
    );

    const newData = {
      client: client,
      employe: employe,
      dateRdv: dateRdv,
      listeServices: listeServices.map((service) => {
        return new ObjectId(service);
      }),
      statut: statut,
    };

    Rendezvousdb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteRendezvous = async (req, res) => {
  const functionName = "deleteRendezvous";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Rendezvousdb.findByIdAndDelete(new ObjectId(id), { session })
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
