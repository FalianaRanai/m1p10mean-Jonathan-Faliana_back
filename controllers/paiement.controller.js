const Paiementdb = require("../models/paiement.model");
const controllerName = "paiement.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const moment = require("moment-timezone");

exports.getChiffreAffaireParJour = (req, res) => {
  const functionName = "getChiffreAffaireParJour";
  try {
    verifyArgumentExistence(["date"], req.body);
    const { date } = req.body;

    let date1 = new Date(date.toString());

    let date2 = new Date(date.toString());
    date2.setDate(date2.getDate() + 1);

    // console.log(date1, date2);

    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    Paiementdb.find({
      isDeleted: false,
      createdAt: { $gte: moment(date1).tz("Indian/Antananarivo").toDate(), $lte: moment(date2).tz("Indian/Antananarivo").toDate() },
    })
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

exports.getChiffreAffaireParMois = (req, res) => {
  const functionName = "getChiffreAffaireParMois";
  try {
    let date = new Date();
    date.setDate(1);
    console.log(date);

    let date1 = new Date(date.toString());

    let date2 = new Date(date.toString());
    date2.setMonth(date.getMonth() + 1);

    // console.log(date1, date2);

    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    Paiementdb.find({
      isDeleted: false,
      createdAt: { $gte: moment(date1).tz("Indian/Antananarivo").toDate(), $lte: moment(date2).tz("Indian/Antananarivo").toDate() },
    })
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
