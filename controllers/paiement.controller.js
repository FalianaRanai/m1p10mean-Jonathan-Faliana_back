const Paiementdb = require("../models/paiement.model");
const controllerName = "paiement.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const moment = require("moment-timezone");

// exports.getChiffreAffaireParJour = (req, res) => {
//     const functionName = "getChiffreAffaireParJour";
//     try {
//         verifyArgumentExistence(["date"], req.body);
//         const { date } = req.body;

//         let date1 = new Date(date.toString());

//         let date2 = new Date(date.toString());
//         date2.setDate(date2.getDate() + 1);

//         // console.log(date1, date2);

//         date1.setHours(0, 0, 0, 0);
//         date2.setHours(0, 0, 0, 0);

//         Paiementdb.find({
//             isDeleted: false,
//             createdAt: { $gte: moment(date1).tz("Indian/Antananarivo").toDate(), $lte: moment(date2).tz("Indian/Antananarivo").toDate() },
//         })
//             .then((data) => {
//                 sendSuccessResponse(res, data, controllerName, functionName);
//             })
//             .catch((err) => {
//                 sendErrorResponse(res, err, controllerName, functionName);
//             });
//     } catch (err) {
//         sendErrorResponse(res, err, controllerName, functionName);
//     }
// };

// exports.getChiffreAffaireParMois = (req, res) => {
//     const functionName = "getChiffreAffaireParMois";
//     try {
//         let date = new Date();
//         date.setDate(1);
//         console.log(date);

//         let date1 = new Date(date.toString());

//         let date2 = new Date(date.toString());
//         date2.setMonth(date.getMonth() + 1);

//         // console.log(date1, date2);

//         date1.setHours(0, 0, 0, 0);
//         date2.setHours(0, 0, 0, 0);

//         Paiementdb.find({
//             isDeleted: false,
//             createdAt: { $gte: moment(date1).tz("Indian/Antananarivo").toDate(), $lte: moment(date2).tz("Indian/Antananarivo").toDate() },
//         })
//             .then((data) => {
//                 sendSuccessResponse(res, data, controllerName, functionName);
//             })
//             .catch((err) => {
//                 sendErrorResponse(res, err, controllerName, functionName);
//             });
//     } catch (err) {
//         sendErrorResponse(res, err, controllerName, functionName);
//     }
// };

exports.getChiffreAffaireParJour = (req, res) => {
    const functionName = "getChiffreAffaireParJour";
    try {
        const numDays = (y, m) => new Date(y, m, 0).getDate();

        const currentDate = new Date();

        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$createdAt" },
                    count: { $sum: "$montant" }
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

        Paiementdb
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
        sendErrorResponse(res, err, controllerName, functionName);
    }
};


exports.getChiffreAffaireParMois = (req, res) => {
    const functionName = "getChiffreAffaireParMois";
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

        Paiementdb.aggregate([
            {
                $match: {
                    isDeleted: false,
                    createdAt: {
                        $gte: new Date(year, 0, 1),
                        $lt: new Date(year + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: "$montant" }
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
        sendErrorResponse(res, err, controllerName, functionName);
    }
};
