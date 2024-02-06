const Rendezvousdb = require("../models/rendezvous.model");
const Clientdb = require("../models/client.model");
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
      .populate({
        path: "client",
        populate: { path: "user", populate: { path: "role" } },
      })
      .populate({
        path: "employe",
        populate: { path: "user", populate: { path: "role" } },
      })
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
      .populate({
        path: "client",
        populate: { path: "user", populate: { path: "role" } },
      })
      .populate({
        path: "employe",
        populate: { path: "user", populate: { path: "role" } },
      })
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
      statut: new ObjectId(statut),
    };

    const dataToInsert = new Rendezvousdb(newData);
    dataToInsert
      .save({ session })
      .then(async (data) => {

        await Clientdb.updateOne({ _id: data.client  }, { $push: { historiqueRDV: data._id } });
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
      statut: new ObjectId(statut),
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

        await Clientdb.updateOne({ _id: data.client  }, { $pull: { historiqueRDV: data._id } });

        sendSuccessResponse(res, data, controllerName, functionName, session);

      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};
