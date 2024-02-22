const Offredb = require("../models/offre.model");
const controllerName = "offre.controller";
const mongoose = require("mongoose");
const Userdb = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const moment = require("moment-timezone");

exports.getOffre = (req, res) => {
  const functionName = "getOffre";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Offredb.find({ _id: id, isDeleted: false })
      .populate("service")
      .then((data) => {
        sendSuccessResponse(
          res,
          data ? data[0] : null,
          controllerName,
          functionName
        );
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.getListeOffre = (req, res) => {
  const functionName = "getListeOffre";
  try {
    Offredb.find({ isDeleted: false })
      .populate("service")
      .then((data) => {
        console.log(data);
        sendSuccessResponse(res, data, controllerName, functionName);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.addOffre = async (req, res) => {
  const functionName = "addOffre";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { nomOffre, dateDebut, dateFin, service, remise } = req.body;
    verifyArgumentExistence(
      ["nomOffre", "dateDebut", "dateFin", "service", "remise"],
      req.body
    );

    const newData = {
      nomOffre: nomOffre,
      dateDebut: dateDebut,
      dateFin: dateFin,
      service: new ObjectId(service),
      remise: remise,
    };

    const dataToInsert = new Offredb(newData);
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

exports.updateOffre = async (req, res) => {
  const functionName = "updateOffre";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // console.log("params", req.params, "body", req.body);
    const { id } = req.params;
    const { nomOffre, dateDebut, dateFin, service, remise } = req.body;

    verifyArgumentExistence(
      ["nomOffre", "dateDebut", "dateFin", "service", "remise"],
      req.body
    );
    verifyArgumentExistence(["id"], req.params);

    const newData = {
      nomOffre: nomOffre,
      dateDebut: dateDebut,
      dateFin: dateFin,
      service: new ObjectId(service),
      remise: remise,
    };
    Offredb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteOffre = async (req, res) => {
  const functionName = "deleteOffre";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);
    Offredb.findByIdAndUpdate(
      new ObjectId(id),
      { isDeleted: true },
      { session }
    )
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

exports.getOffreEnCours = (req, res) => {
  const functionName = "getOffreEnCours";
  try {
    Offredb.find({
      dateDebut: { $lte: moment(new Date()).tz("Indian/Antananatarivo") },
      dateFin: { $gte: moment(new Date()).tz("Indian/Antananatarivo") },
      isDeleted: false,
    })
      .populate("service")
      .then((data) => {
        sendSuccessResponse(
          res,
          data ? data[0] : null,
          controllerName,
          functionName
        );
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};
