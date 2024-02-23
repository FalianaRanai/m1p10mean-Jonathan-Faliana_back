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
const sendMail = require("../utils/sendMail.util");
const moment = require("moment-timezone");

const RdvController = require("./service.controller");

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

        const { client, dateDebutRdv, dateFinRdv, clientEmail } = req.body;
        let { listeTaches, paiement } = req.body;

        // console.log(req.body);

        // listeTaches = listeTaches.map(async (tache) => {
        //     let service = await Servicedb.findOne({_id: new ObjectId(tache.service)});
        //     return {...tache, prix: service.prix, prixAvantRemise: 0 };  
        // });

        let temp = [];
        let services = [];
        for (let i = 0; i < listeTaches.length; i++) {
            let tache = listeTaches[i];
            // let service = await Servicedb.findOne({ _id: new ObjectId(tache.service) });
            let service = await RdvController.findServiceDetails({ isDeleted: false, _id: new ObjectId(tache.service) }, new Date(), new Date())
            
            services.push(service[0].nomService);
            temp.push({ ...tache, prix: service[0].prix, prixAvantRemise: service[0].prixAvantRemise });
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

                var htmlTask = '<p>';
                for (let i = 0; i < temp.length; i++) {
                    htmlTask += '<p>Nom: '+services[i]+'</p>'
                    htmlTask += '<p>Prix: $ '+temp[0].prix+'</p>'
                    htmlTask += '<br/>'
                }
                htmlTask += '</p>';
                
                await sendMail(
                    clientEmail,
                    {name: "Beautify", email: process.env.FROM_EMAIL},
                    "Paiement effectué avec succès le "+moment().tz("Indian/Antananarivo").format('YYYY-MM-DD HH:mm:ss'),
                    "Votre paiement a été réalisé avec succès le "+moment().tz("Indian/Antananarivo").format('YYYY-MM-DD HH:mm:ss')+".",
                    htmlTask   
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
        console.log(err);
        sendErrorResponse(res, err, controllerName, functionName);
    }
};

exports.getRdvReservationParMois = (req, res) => {
    const functionName = "getRdvReservationParMois";
    try {
        var year = new Date().getFullYear();

        var monthsArray = [
            { month: 1, name: "Janvier" },
            { month: 2, name: "Fevrier" },
            { month: 3, name: "Mars" },
            { month: 4, name: "Avril" },
            { month: 5, name: "Mai" },
            { month: 6, name: "Juin" },
            { month: 7, name: "Juillet" },
            { month: 8, name: "Aout" },
            { month: 9, name: "Septembre" },
            { month: 10, name: "Octobre" },
            { month: 11, name: "Novembre" },
            { month: 12, name: "Decembre" }
        ];

        Rendezvousdb.aggregate([
            {
                $match: {
                    isDeleted: false,
                    dateDebutRdv: {
                        $gte: new Date(year, 0, 1), // Start of the year
                        $lt: new Date(year + 1, 0, 1) // Start of the next year
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$dateDebutRdv" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    count: 1
                }
            },
            {
                $sort: { month: 1 }
            }
        ]).then((data) => {
            var resultMap = new Map(data.map(item => [item.month, item.count]));

            var mergedArray = monthsArray.map(month => ({
                // month: month.month,
                label: month.name,
                value: resultMap.has(month.month) ? resultMap.get(month.month) : 0
            }));

            sendSuccessResponse(res, mergedArray, controllerName, functionName);
        })
            .catch((err) => {
                console.log(err);
                sendErrorResponse(res, err, controllerName, functionName);
            });
    } catch (err) {
        console.log(err);
        sendErrorResponse(res, err, controllerName, functionName);
    }
};

exports.getRdvReservationParJour = (req, res) => {
    const functionName = "getRdvReservationParJour";
    try {
        const numDays = (y, m) => new Date(y, m, 0).getDate();

        const currentDate = new Date();

        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const pipeline = [
            {
                $match: {
                    dateDebutRdv: { $gte: startOfMonth, $lt: endOfMonth },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$dateDebutRdv" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    day: "$_id",
                    count: 1
                }
            }
        ];

        Rendezvousdb
            .aggregate(pipeline)
            .then((result) => {
                const daysInMonth = Array.from({ length: numDays(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1) }, (_, i) => ({
                    label: i + 1,
                    value: 0
                }));

                result.forEach(item => {
                    const dayIndex = item.day - 1;
                    daysInMonth[dayIndex].value = item.count;
                });

                sendSuccessResponse(res, daysInMonth, controllerName, functionName);
            })
            .catch((err) => {
                console.log(err);
                sendErrorResponse(res, err, controllerName, functionName);
            });
    } catch (err) {
        console.log(err);
        sendErrorResponse(res, err, controllerName, functionName);
    }
};