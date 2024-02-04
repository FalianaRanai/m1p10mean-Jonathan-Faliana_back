const Servicedb = require("../models/service.model");
const controllerName = "service.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");
const writeFile = require("@utils/writeFile.util");
const deleteFile = require("@utils/deleteFile.util");

exports.getService = (req, res) => {
  const functionName = "getService";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Servicedb.findById(id)
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

exports.getListeService = (req, res) => {
  const functionName = "getListeService";
  try {
    Servicedb.find({})
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

exports.addService = async (req, res) => {
  const functionName = "addService";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { nomService, prix, duree, commission, description } = req.body;

    verifyArgumentExistence(
      ["nomService", "prix", "duree", "commission", "description"],
      req.body
    );

    let nomFichier = writeFile(req, "Service");

    let newData = {
      nomService: nomService,
      prix: prix,
      duree: duree,
      commission: commission,
      description: description,
      image : nomFichier ? nomFichier : undefined,
      icone: nomFichier ? "" : "flaticon-mortar",
    };

    const dataToInsert = new Servicedb(newData);
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

exports.updateService = async (req, res) => {
  const functionName = "updateService";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { nomService, prix, duree, commission, description } = req.body;

    verifyArgumentExistence(["id"], req.params);
    verifyArgumentExistence(
      ["nomService", "prix", "duree", "commission", "description"],
      req.body
    );

    let nomFichier = writeFile(req, "Service");

    const newData = {
      nomService: nomService,
      prix: prix,
      duree: duree,
      commission: commission,
      description: description,
      image: nomFichier ? nomFichier : undefined
    };

    Servicedb.findByIdAndUpdate(new ObjectId(id), newData, {
      session,
    })
      .then(async (data) => {
        if (nomFichier) {
          deleteFile({
            repository: "Service",
            res: res,
            data: data,
            controllerName: controllerName,
            functionName: functionName,
            session: session,
          });
        }
        else{
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

exports.deleteService = async (req, res) => {
  const functionName = "deleteService";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Servicedb.findByIdAndDelete(new ObjectId(id), { session })
      .then(async (data) => {
        deleteFile({
          repository: "Service",
          res: res,
          data: data,
          controllerName: controllerName,
          functionName: functionName,
          session: session,
        });
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};
