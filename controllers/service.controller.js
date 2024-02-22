const Servicedb = require("../models/service.model");
const controllerName = "service.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const writeFile = require("../utils/writeFile.util");
const deleteFile = require("../utils/deleteFile.util");
const writeMultipleFile = require("../utils/writeMultipleFile.util");
const deleteMultipleFile = require("../utils/deleteMultipleFile.util");
const Employedb = require("../models/employe.model");
const Offredb = require("../models/offre.model");

exports.getService = (req, res) => {
    const functionName = "getService";
    try {
        const { id } = req.params;
        verifyArgumentExistence(["id"], req.params);

        const currentDate = new Date();
        // Servicedb.aggregate([
        //     {
        //         $match: { isDeleted: false, _id: new ObjectId(id) },
        //     },
        //     {
        //         $lookup: {
        //             from: "offres",
        //             let: { serviceId: "$_id" },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 { $eq: ["$service", "$$serviceId"] },
        //                                 { $lte: ["$dateDebut", currentDate] },
        //                                 { $gte: ["$dateFin", currentDate] },
        //                             ],
        //                         },
        //                     },
        //                 },
        //             ],
        //             as: "listeOffresActive",
        //         },
        //     },
        //     {
        //         $addFields: { 
        //             prixAvantRemise: "$prix",
        //             prix: {
        //                 $cond: {
        //                     if: { $ne: [{ $size: "$listeOffresActive" }, 0] },
        //                     then: { $multiply: ["$prix", { $divide: [ { $arrayElemAt: ["$listeOffresActive.remise", 0] }, 100] }] },
        //                     else: "$prix"
        //                 }
        //             }
        //         }
        //     }
        // ])
        this.findServiceDetails({ isDeleted: false, _id: new ObjectId(id) }, currentDate, currentDate)
            .then((data) => {
                console.log(data);
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

exports.getListeService = (req, res) => {
    const functionName = "getListeService";
    try {
        // Servicedb.find({ isDeleted: false })

        const currentDate = new Date();

        Servicedb.aggregate([
            {
                $match: { isDeleted: false },
            },
            {
                $lookup: {
                    from: "offres",
                    let: { serviceId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$service", "$$serviceId"] },
                                        { $lte: ["$dateDebut", currentDate] },
                                        { $gte: ["$dateFin", currentDate] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "listeOffresActive",
                },
            },
            {
                $addFields: { 
                    prixAvantRemise: "$prix",
                    prix: {
                        $cond: {
                            if: { $ne: [{ $size: "$listeOffresActive" }, 0] },
                            then: { $multiply: ["$prix", { $divide: [ { $arrayElemAt: ["$listeOffresActive.remise", 0] }, 100] }] },
                            else: "$prix"
                        }
                    }
                }
            }
        ])
            .then(async (data) => {
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
            ["nomService", "prix", "duree", "commission"],
            req.body
        );

        let nomFichier = await writeFile(req, "Service");

        let nomsFichiers = await writeMultipleFile(req, "Service", "files");

        let newData = {
            nomService: nomService,
            prix: prix,
            duree: duree,
            commission: commission,
            description: description ? description : undefined,
            image: nomFichier ? nomFichier : undefined,
            icone: "",
            galerie: nomsFichiers ? nomsFichiers : undefined,
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
        const { nomService, prix, duree, commission, description, icone } =
            req.body;

        verifyArgumentExistence(["id"], req.params);
        verifyArgumentExistence(
            ["nomService", "prix", "duree", "commission"],
            req.body
        );

        let nomFichier = await writeFile(req, "Service");
        let nomsFichiers = await writeMultipleFile(req, "Service", "files");

        const newData = {
            nomService: nomService,
            prix: prix,
            duree: duree,
            commission: commission,
            description: description ? description : undefined,
            image: nomFichier ? nomFichier : undefined,
            galerie: nomsFichiers ? nomsFichiers : undefined,
            icone: icone ? icone : "",
        };

        Servicedb.findByIdAndUpdate(new ObjectId(id), newData, {
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

exports.deleteService = async (req, res) => {
    const functionName = "deleteService";
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        verifyArgumentExistence(["id"], req.params);

        Servicedb.findByIdAndUpdate(
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

exports.findServiceDetails = (matchQuery, dateDeb, dateFin) => {
    return Servicedb.aggregate([
        {
            $match: matchQuery,
        },
        {
            $lookup: {
                from: "offres",
                let: { serviceId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$service", "$$serviceId"] },
                                    { $lte: ["$dateDebut", dateDeb] },
                                    { $gte: ["$dateFin", dateFin] },
                                ],
                            },
                        },
                    },
                ],
                as: "listeOffresActive",
            },
        },
        {
            $addFields: { 
                prixAvantRemise: "$prix",
                prix: {
                    $cond: {
                        if: { $ne: [{ $size: "$listeOffresActive" }, 0] },
                        then: { $multiply: ["$prix", { $divide: [ { $arrayElemAt: ["$listeOffresActive.remise", 0] }, 100] }] },
                        else: "$prix"
                    }
                }
            }
        }
    ])
};
