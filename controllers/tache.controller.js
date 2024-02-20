const Tachedb = require("../models/tache.model");
const controllerName = "tache.controller";
const mongoose = require("mongoose");
const Employedb = require("../models/employe.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const Statutdb = require("../models/statut.model");

exports.getTache = (req, res) => {
    const functionName = "getTache";
    try {
        const { id } = req.params;
        verifyArgumentExistence(["id"], req.params);

        Tachedb.find({ _id: id, isDeleted: false })
            .populate({
                path: "employe",
                populate: { path: "user", populate: { path: "role" } },
            })
            .populate("service")
            .populate("statut")
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

exports.getListeTache = (req, res) => {
    const functionName = "getListeTache";
    try {
        Tachedb.find({ isDeleted: false })
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
        const {
            dateDebut,
            dateFin,
            employe,
            service,
            statut,
            prix,
            prixAvantRemise,
        } = req.body;
        verifyArgumentExistence(
            [
                "dateDebut",
                "dateFin",
                "employe",
                "service",
                "statut",
                "prix",
                "prixAvantRemise",
            ],
            req.body
        );

        const newData = {
            dateDebut: dateDebut,
            dateFin: dateFin,
            employe: new ObjectId(employe),
            service: new ObjectId(service),
            statut: new ObjectId(statut),
            prix: prix,
            prixAvantRemise: prixAvantRemise,
        };

        const dataToInsert = new Tachedb(newData);
        dataToInsert
            .save({ session })
            .then(async (data) => {
                await Employedb.updateOne(
                    { _id: data.employe },
                    { $push: { listeTaches: data._id } }
                );
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

        verifyArgumentExistence(
            ["dateDebut", "dateFin", "employe", "service", "statut"],
            req.body
        );
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
                await Employedb.findByIdAndUpdate(
                    { _id: data.employe },
                    { $pull: { listeTaches: data._id } },
                    { session }
                );
                await Employedb.findByIdAndUpdate(
                    { _id: newData.employe },
                    { $push: { listeTaches: data._id } },
                    { session }
                );
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
        Tachedb.findByIdAndUpdate(
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

exports.getTacheByEmpToday = (req, res) => {
    const functionName = "getTacheByEmpToday";
    try {
        verifyArgumentExistence(["id"], req.params);

        const { id } = req.params;

        Tachedb.find({
            employe: id,
            isDeleted: false,
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$dateDebut" } },
                    { $dateToString: { format: "%Y-%m-%d", date: new Date() } },
                ],
            },
        })
            .populate({
                path: "employe",
                populate: { path: "user", populate: { path: "role" } },
            })
            .populate("service")
            .populate("statut")
            .populate("client")
            .then((data) => {
                sendSuccessResponse(
                    res,
                    data ? data : null,
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

exports.getTacheByEmp = (req, res) => {
    const functionName = "getTacheByEmp";
    try {
        verifyArgumentExistence(["id"], req.params);

        const { id } = req.params;

        Tachedb.find({ employe: id, isDeleted: false })
            .populate({
                path: "employe",
                populate: { path: "user", populate: { path: "role" } },
            })
            .populate("service")
            .populate("statut")
            .populate("client")
            .then((data) => {
                sendSuccessResponse(
                    res,
                    data ? data : null,
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

exports.updateTaches = async (req, res) => {
    const functionName = "updateTaches";
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        verifyArgumentExistence(["token"], req.params);
        verifyArgumentExistence(["listeTache"], req.body);

        const { token } = req.params;
        const { listeTache } = req.body;

        let statutTermine = await Statutdb.findOne({ nomStatut: "terminé" });
        if (!statutTermine) {
            await new Statutdb({ nomStatut: "terminé" }).save();
            statutTermine = await Statutdb.findOne({ nomRole: "terminé" });
        }

        listeTache.forEach(async (tache) => {
            await Tachedb.updateOne(
                { _id: tache._id },
                { statut: statutTermine._id }
            );
        });

        sendSuccessResponse(res, null, controllerName, functionName);
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName);
    }
};

exports.getReservationParJour = (req, res) => {
    const functionName = "getReservationParJour";
    try {
        verifyArgumentExistence(["date"], req.body);
        const { date } = req.body;

        let date1 = new Date(date);

        let date2 = new Date(date);
        date2.setDate(date2.getDate() + 1);

        // console.log(date1, date2);

        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);

        Servicedb.aggregate([
            {
                $lookup: {
                    from: "taches",
                    localField: "_id",
                    foreignField: "service",
                    as: "taches",
                },
            },
            {
                $match: {
                    "taches.isDeleted": false,
                    "taches.dateDebut": {
                        $gte: moment(date1).tz("Indian/Antananarivo").toDate(),
                    },
                    "taches.dateFin": {
                        $lte: moment(date2).tz("Indian/Antananarivo").toDate(),
                    },
                },
            },
        ])
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

exports.getReservationParMois = (req, res) => {
    const functionName = "getReservationParMois";
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

        Servicedb.aggregate([
            {
                $lookup: {
                    from: "taches",
                    localField: "_id",
                    foreignField: "service",
                    as: "taches",
                },
            },
            {
                $match: {
                    "taches.isDeleted": false,
                    "taches.dateDebut": {
                        $gte: moment(date1).tz("Indian/Antananarivo").toDate(),
                    },
                    "taches.dateFin": {
                        $lte: moment(date2).tz("Indian/Antananarivo").toDate(),
                    },
                },
            },
        ])
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
