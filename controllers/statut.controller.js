const Statutdb = require("../models/statut.model");
const controllerName = "statut.controller";
const mongoose = require("mongoose");
const Userdb = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("@utils/sendErrorResponse.util");
const sendSuccessResponse = require("@utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("@utils/verifyArgumentExistence");

exports.getStatut = (req, res) => {
    const functionName = "getStatut";
    try {
        const { id } = req.params;
        verifyArgumentExistence(["id"], req.params);

        Statutdb.find({ _id: id, isDeleted: false })
            .then((data) => {
                sendSuccessResponse(res, data ? data[0] : null, controllerName, functionName);
            })
            .catch((err) => {
                sendErrorResponse(res, err, controllerName, functionName);
            });
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName);
    }
};

exports.getListeStatut = (req, res) => {
    const functionName = "getListeStatut";
    try {
        Statutdb.find({ isDeleted: false })
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

exports.addStatut = async (req, res) => {
    const functionName = "addStatut"
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { nomStatut } = req.body;
        verifyArgumentExistence(["nomStatut"], req.body);

        const newData = {
            nomStatut: nomStatut,
        };

        const dataToInsert = new Statutdb(newData);
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

exports.updateStatut = async (req, res) => {
    const functionName = "updateStatut";
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // console.log("params", req.params, "body", req.body);
        const { id } = req.params;
        const { nomStatut } = req.body;


        verifyArgumentExistence(["nomStatut"], req.body);
        verifyArgumentExistence(["id"], req.params);

        const newData = {
            nomStatut: nomStatut,
        };
        Statutdb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteStatut = async (req, res) => {
    const functionName = "deleteStatut";
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        verifyArgumentExistence(["id"], req.params);
        Statutdb.findByIdAndUpdate(new ObjectId(id), { isDeleted: true }, { session })
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

exports.getStatutEnCours = async (req, res) => {
    const functionName = "getStatutEnCours";
    try {

        Statutdb.find({ nomStatut: "en cours", isDeleted: false })
            .then(async (data) => {

                let statutEncours = data ? data[0] : null;
                if (!statutEncours) {
                    await (new Statutdb({ nomStatut: "en cours" })).save();
                    statutEncours = await Statutdb.findOne({ nomStatut: "en cours", isDeleted: false });
                }

                sendSuccessResponse(res, statutEncours, controllerName, functionName);
            })
            .catch((err) => {
                sendErrorResponse(res, err, controllerName, functionName);
            });
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName);
    }
}

exports.generationStatutBase = async(req, res) => {
    const functionName = "generationStatutBase";
    const statut = ['en cours', 'terminé'];
    try {
        statut.forEach(async (nomStatut)=>{
            let statutTemp = await Statutdb.findOne({ nomStatut: nomStatut });
            if (!statutTemp) {
                await new Statutdb({ nomStatut: nomStatut }).save();
            }
        });

        sendSuccessResponse(res, null, controllerName, functionName);
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName);
    }
}

exports.getStatutTermine = async (req, res) => {
    const functionName = "getStatutTermine";
    try {

        Statutdb.find({ nomStatut: "terminé", isDeleted: false })
            .then(async (data) => {

                let statutEncours = data ? data[0] : null;
                if (!statutEncours) {
                    await (new Statutdb({ nomStatut: "terminé" })).save();
                    statutEncours = await Statutdb.findOne({ nomStatut: "terminé", isDeleted: false });
                }

                sendSuccessResponse(res, statutEncours, controllerName, functionName);
            })
            .catch((err) => {
                sendErrorResponse(res, err, controllerName, functionName);
            });
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName);
    }
}
