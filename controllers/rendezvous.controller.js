const Rendezvousdb = require("../models/rendezvous.model");
const Paiementdb = require("../models/paiement.model");
const Clientdb = require("../models/client.model");
const Tachedb = require("../models/tache.model");
const controllerName = "rendezvous.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const Employedb = require("../models/employe.model");
const Servicedb = require("../models/service.model");

exports.getRendezvous = (req, res) => {
  const functionName = "getRendezvous";
  try {
    const { id } = req.params;
    verifyArgumentExistence(["id"], req.params);

    Rendezvousdb.find({ _id: id, isDeleted: false })
      .populate({
        path: "client",
        populate: [
          { path: "user", populate: { path: "role" } },
          {
            path: "historiqueRDV",
            populate: [
              {
                path: "listeTaches",
                populate: [
                  {
                    path: "employe",
                    populate: [
                      { path: "user", populate: { path: "role" } },
                      { path: "mesServices" },
                    ],
                  },
                  { path: "service" },
                  { path: "statut" },
                ],
              },
            ],
          },
        ],
      })
      .populate({
        path: "listeTaches",
        populate: [
          {
            path: "employe",
            populate: [
              { path: "user", populate: { path: "role" } },
              { path: "mesServices" },
            ],
          },
          { path: "service" },
          { path: "statut" },
        ],
      })
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

exports.getListeRendezvous = (req, res) => {
  const functionName = "getListeRendezvous";
  try {
    Rendezvousdb.find({ isDeleted: false })
      .populate({
        path: "client",
        populate: [
          { path: "user", populate: { path: "role" } },
          {
            path: "historiqueRDV",
            populate: [
              {
                path: "listeTaches",
                populate: [
                  {
                    path: "employe",
                    populate: [
                      { path: "user", populate: { path: "role" } },
                      { path: "mesServices" },
                    ],
                  },
                  { path: "service" },
                  { path: "statut" },
                ],
              },
            ],
          },
        ],
      })
      .populate({
        path: "listeTaches",
        populate: [
          {
            path: "employe",
            populate: [
              { path: "user", populate: { path: "role" } },
              { path: "mesServices" },
            ],
          },
          { path: "service" },
          { path: "statut" },
        ],
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

exports.addRendezvous = async (req, res) => {
  const functionName = "addRendezvous";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    verifyArgumentExistence(
      ["client", "dateDebutRdv", "dateFinRdv", "listeTaches", "paiement"],
      req.body
    );

    const { client, dateDebutRdv, dateFinRdv } = req.body;
    let { listeTaches, paiement } = req.body;

    // console.log(req.body);

    // listeTaches = listeTaches.map(async (tache) => {
    //     let service = await Servicedb.findOne({_id: new ObjectId(tache.service)});
    //     return {...tache, prix: service.prix, prixAvantRemise: 0 };  
    // });

    let temp = [];
    for(let i = 0; i < listeTaches.length; i++){
        let tache = listeTaches[i];
        let service = await Servicedb.findOne({_id: new ObjectId(tache.service)});
        // console.log("service: ", service);
        temp.push({...tache, prix: service.prix, prixAvantRemise: service.prixAvantRemise });
    }
    // console.log("ora ora", temp);

    const newTache = await Tachedb.insertMany(temp);
    // console.log("newTache: ", newTache);

    const newPaiement = await new Paiementdb(paiement).save({ session });
    const tacheIds = newTache.map((task) => task._id);

    const updateListeTachesEmploye = newTache.map((element) => {
      return { idEmploye: element.employe, idTache: element._id };
    });
    for (let i = 0; i < updateListeTachesEmploye.length; i++) {
      await Employedb.updateOne(
        { _id: new ObjectId(updateListeTachesEmploye[i].idEmploye) },
        { $push: { listeTaches: new ObjectId(updateListeTachesEmploye[i].idTache) } }
      );
    }

    // const newData = {
    //     client: new ObjectId(client),
    //     dateDebutRdv: dateDebutRdv,
    //     dateFinRdv: dateFinRdv,
    //     listeTaches: listeTaches.map((tache) => {
    //         return new ObjectId(new Tachedb(tache));
    //     }),
    // };

    const newData = {
      client: new ObjectId(client),
      dateDebutRdv: dateDebutRdv,
      dateFinRdv: dateFinRdv,
      listeTaches: tacheIds,
      paiement: newPaiement._id,
    };

    const dataToInsert = new Rendezvousdb(newData);
    dataToInsert
      .save({ session })
      .then(async (data) => {
        await Clientdb.updateOne(
          { _id: data.client },
          { $push: { historiqueRDV: data._id } }
        );
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.updateRendezvous = async (req, res) => {
  const functionName = "updateRendezvous";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { client, dateDebutRdv, dateFinRdv, listeTaches } = req.body;

    verifyArgumentExistence(["id"], req.params);
    verifyArgumentExistence(
      ["client", "dateDebutRdv", "dateFinRdv", "listeTaches"],
      req.body
    );

    const newData = {
      client: client,
      dateDebutRdv: dateDebutRdv,
      dateFinRdv: dateFinRdv,
      listeTaches: listeTaches.map((tache) => {
        return new ObjectId(tache);
      }),
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

    Rendezvousdb.findByIdAndUpdate(
      new ObjectId(id),
      { isDeleted: true },
      { session }
    )
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

exports.getListeRdvParClient = (req, res) => {
  const functionName = "getListeRdvParClient";
  try {
    verifyArgumentExistence(["id"], req.params);
    const { id } = req.params;

    Rendezvousdb.find({ client: id })
      .populate({
        path: "listeTaches",
        populate: [
          {
            path: "employe",
            populate: [
              { path: "user", populate: { path: "role" } },
              { path: "mesServices" },
            ],
          },
          { path: "service" },
          { path: "statut" },
        ],
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
