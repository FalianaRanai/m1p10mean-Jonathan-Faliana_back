const Servicedb = require("../models/service.model");
const controllerName = "service.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");
const fs = require("fs");
const path = require('path');

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

    let nomFichier;
    if(req.file){

      const { originalname, buffer } = req.file;
      const extension = path.extname(originalname);
      const basename = path.basename(originalname, extension);
      nomFichier = `${basename} - ${Date.now()}`+extension;

      const filePath = `./public/Service/${nomFichier}`;

      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("File uploaded successfully");
        }
      });

    }

    let newData = {
      nomService: nomService,
      prix: prix,
      duree: duree,
      commission: commission,
    };

    if(nomFichier){
      newData.image = nomFichier;
    }
    else{
      newData.icone = "flaticon-mortar";
    }

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
    const { nomService, prix, duree, commission } = req.body;

    verifyArgumentExistence(["id"], req.params);
    verifyArgumentExistence(
      ["nomService", "prix", "duree", "commission"],
      req.body
    );

    let nomFichier;
    if(req.file){

      const { originalname, buffer } = req.file;
      const extension = path.extname(originalname);
      const basename = path.basename(originalname, extension);
      nomFichier = `${basename} - ${Date.now()}`+extension;

      const filePath = `./public/Service/${nomFichier}`;
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error(err);
        } else {
          // response.send("Image uploaded successfully");
          console.log("Image uploaded successfully");
        }
      });
    }


    const newData = {
      nomService: nomService,
      prix: prix,
      duree: duree,
      commission: commission,
    };
    if(nomFichier){
      newData.image = nomFichier;
    }

    Servicedb.findByIdAndUpdate(new ObjectId(id), newData, {
      session,
    })
      .then(async (data) => {

        if(nomFichier){
          // Chemin du fichier à supprimer
          const filePathToDelete = `./public/Service/${data.image}`;

          // Suppression du fichier
          fs.unlink(filePathToDelete, (err) => {
            if (err) {
              console.error(`Erreur lors de la suppression du fichier ${data.image}`, err);
              throw new Error("Erreur lors de la suppression (de l'image) de la donnée");
            } else {
              console.log(`Fichier ${data.image} supprimé avec succès`);
              sendSuccessResponse(res, data, controllerName, functionName, session);
            }
          });
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

        // Chemin du fichier à supprimer
        const filePathToDelete = `./public/Service/${data.image}`;

        // Suppression du fichier
        fs.unlink(filePathToDelete, (err) => {
          if (err) {
            console.error(`Erreur lors de la suppression du fichier ${data.image}`, err);
            throw new Error("Erreur lors de la suppression (de l'image) de la donnée");
          } else {
            console.log(`Fichier ${data.image} supprimé avec succès`);
            sendSuccessResponse(res, data, controllerName, functionName, session);
          }
        });
        // sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};
