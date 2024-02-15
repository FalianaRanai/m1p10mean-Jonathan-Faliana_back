const Employedb = require("../models/employe.model");
const Roledb = require("../models/role.model");
const Userdb = require("../models/user.model");
const controllerName = "employe.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const bcrypt = require("bcrypt");
const writeFile = require("../utils/writeFile.util");
const NAMES = require("../utils/randomData.util");
const getRandomNumber = require("../utils/getRandomNumber.util");
const getRandomNumbersInArray = require("../utils/getRandomNumbersInArray.util");
const Servicedb = require("../models/service.model");
const moment = require("moment-timezone");
const HoraireTravaildb = require("../models/horaireTravail.model");

exports.getEmploye = (req, res) => {
    const functionName = "getEmploye";
    try {
        const { id } = req.params;
        verifyArgumentExistence(["id"], req.params);

    Employedb.find({ _id: id, isDeleted: false })
      .populate({ path: "user", populate: { path: "role" } })
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
      .populate("mesServices")
      .populate("horaireTravail")
      .then((data) => {
        // console.log(data);
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
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.getListeEmploye = (req, res) => {
    const functionName = "getListeEmploye";
    try {
        Employedb.find({ isDeleted: false })
            .populate({ path: "user", populate: { path: "role" } })
            .populate({
                path: "listeTaches",
                populate: [
                    {
                        path: "employe",
                        populate: { path: "user", populate: { path: "role" } },
                    },
                    { path: "service" },
                    { path: "statut" },
                ],
            })
            .populate("mesServices")
            .populate("horaireTravail")
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

exports.addEmploye = async (req, res) => {
    const functionName = "addEmploye";
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        var {
            nomEmploye,
            prenomEmploye,
            email,
            password,
            confirmPassword,
            mesServices,
            horaireTravail,
        } = req.body;

        verifyArgumentExistence(
            [
                "nomEmploye",
                "prenomEmploye",
                "email",
                "password",
                "confirmPassword",
                "mesServices",
                "horaireTravail",
            ],
            req.body
        );

        if ((password && !confirmPassword) || (!password && confirmPassword)) {
            throw new Error("Veillez remplir les champs de mot de passe");
        }
        if (confirmPassword && confirmPassword !== password) {
            throw new Error("Les mots de passes ne correspondent pas");
        }

        let role = await Roledb.findOne({ nomRole: "Employe" });
        if (!role) {
            await new Roledb({ nomRole: "Employe" }).save();
            role = await Roledb.findOne({ nomRole: "Employe" });
        }

        const newDataUser = {
            email: email,
            password: bcrypt.hashSync(password, 10),
            role: new ObjectId(role._id),
        };

        const dataUserToInsert = new Userdb(newDataUser);
        dataUserToInsert
            .save({ session })
            .then(async (newUser) => {
                let nomFichier = await writeFile(req, "Employe");

                if (typeof mesServices === "string" || mesServices instanceof String)
                    mesServices = JSON.parse(mesServices);

                horaireTravail = JSON.parse(horaireTravail);

                const newHoraireTravail = await new HoraireTravaildb(
                    horaireTravail
                ).save({ session });

                const newData = {
                    nomEmploye: nomEmploye,
                    prenomEmploye: prenomEmploye,
                    user: new ObjectId(newUser._id),
                    image: nomFichier ? nomFichier : undefined,
                    mesServices: mesServices.map((element) => {
                        return new ObjectId(element);
                    }),
                    horaireTravail: new ObjectId(newHoraireTravail._id),
                };

                const dataToInsert = new Employedb(newData);
                dataToInsert
                    .save({ session })
                    .then(async (data) => {
                        sendSuccessResponse(
                            res,
                            data,
                            controllerName,
                            functionName,
                            session
                        );
                    })
                    .catch((err) => {
                        sendErrorResponse(res, err, controllerName, functionName, session);
                    });
            })
            .catch((err) => {
                sendErrorResponse(res, err, controllerName, functionName, session);
            });
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName, session);
    }
};

exports.updateEmploye = async (req, res) => {
    const functionName = "updateEmploye";
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        var { nomEmploye, prenomEmploye, user, mesServices, horaireTravail } =
            req.body;

        verifyArgumentExistence(["id"], req.params);
        verifyArgumentExistence(
            ["nomEmploye", "prenomEmploye", "user", "mesServices", "horaireTravail"],
            req.body
        );

        let nomFichier = await writeFile(req, "Employe");

        if (typeof mesServices === "string" || mesServices instanceof String)
            mesServices = JSON.parse(mesServices);

        horaireTravail = JSON.parse(horaireTravail);

        const newHoraireTravail = await new HoraireTravaildb(horaireTravail).save({
            session,
        });

        const newData = {
            nomEmploye: nomEmploye,
            prenomEmploye: prenomEmploye,
            user: new ObjectId(user),
            image: nomFichier ? nomFichier : undefined,
            mesServices: mesServices.map((element) => {
                return new ObjectId(element);
            }),
            horaireTravail: new Object(newHoraireTravail._id),
        };

        Employedb.findByIdAndUpdate(new ObjectId(id), newData, {
            session,
        })
            .then(async (data) => {
                if (req.body.password) {
                    let password = req.body.password;
                    let confirmPassword = req.body.confirmPassword;
                    if (
                        (password && !confirmPassword) ||
                        (!password && confirmPassword)
                    ) {
                        throw new Error("Veillez remplir les champs de mot de passe");
                    }
                    if (confirmPassword && confirmPassword !== password) {
                        throw new Error("Les mots de passes ne correspondent pas");
                    }
                    await Userdb.findByIdAndUpdate(
                        new ObjectId(data.user),
                        { password: bcrypt.hashSync(req.body.password, 10) },
                        { session }
                    );
                }

                sendSuccessResponse(res, data, controllerName, functionName, session);
            })
            .catch(async (err) => {
                sendErrorResponse(res, err, controllerName, functionName, session);
            });
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName, session);
    }
};

exports.deleteEmploye = async (req, res) => {
    const functionName = "deleteEmploye";
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        verifyArgumentExistence(["id"], req.params);

        Employedb.findByIdAndUpdate(
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

exports.generateData = async (req, res) => {
    const functionName = "generateData";
    const session = await mongoose.startSession();
    session.startTransaction();

    console.log("NAMES", NAMES.length);

    try {
        const { length } = req.params;
        verifyArgumentExistence(["length"], req.params);

        let random1 = 0;
        let random2 = 0;

        let listeServices = await Servicedb.find({ isDeleted: false });
        let serviceLength = 0;
        let randomIndex = [];

        let mesServices = [];

        let verif = 0;

        let role = await Roledb.findOne({ nomRole: "Employe" });
        if (!role) {
            await new Roledb({ nomRole: "Employe" }).save();
            role = await Roledb.findOne({ nomRole: "Employe" });
        }

        for (let i = 0; i < length; i++) {
            random1 = getRandomNumber(0, NAMES.length - 1);
            random2 = getRandomNumber(0, NAMES.length - 1);

            serviceLength = getRandomNumber(1, listeServices.length);
            randomIndex = getRandomNumbersInArray(
                serviceLength,
                listeServices.length
            );

            mesServices = randomIndex.map((element) => {
                return listeServices[element];
            });

            console.log(random1, random2, randomIndex, NAMES[random1]);

            const newDataUser = {
                email: `${NAMES[random1].toLowerCase()}_${NAMES[
                    random2
                ].toLowerCase()}_${new Date().getTime()}@gmail.com`,
                password: bcrypt.hashSync(`0123456789`, 10),
                role: new ObjectId(role._id),
            };
            const dataUserToInsert = new Userdb(newDataUser);
            let user = await dataUserToInsert.save({ session });

            const horaireTravail = new HoraireTravaildb({
                debut: moment(new Date("2024-01-01 08:00")).tz("Indian/Antananarivo"),
                fin: moment(new Date("2024-01-01 17:00")).tz("Indian/Antananarivo"),
                jourTravail: [1, 2, 3, 4, 5], // replace with your desired days of work
            });
            await horaireTravail.save({ session });
            // console.log('ID de l\'horaireTravail nouvellement inséré :', horaireTravail._id);

            const newData = {
                nomEmploye: NAMES[random1],
                prenomEmploye: NAMES[random2],
                mesServices: mesServices,
                user: user,
                horaireTravail: new ObjectId(horaireTravail._id),
            };
            const dataToInsert = new Employedb(newData);
            await dataToInsert.save({ session });
        }
        sendSuccessResponse(res, null, controllerName, functionName, session);
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName, session);
    }
};

exports.updateHoraireTravail = (req, res) => {
    const functionName = "updateHoraireTravail";

    try {
        verifyArgumentExistence(["id"], req.params);
        verifyArgumentExistence(["debut", "fin", "jourTravail"], req.body);

        const { debut, fin, jourTravail } = req.body;
        const { id } = req.params;

        const updatedValue = {
            horaireTravail: {
                debut: new Date(debut),
                fin: new Date(fin),
                jourTravail: jourTravail,
            },
        };

        Employedb.findOneAndUpdate({ _id: id }, updatedValue)
            .then((data) => {
                sendSuccessResponse(res, null, controllerName, functionName);
            })
            .catch((err) => {
                sendErrorResponse(res, err, controllerName, functionName);
            });
    } catch (err) {
        sendErrorResponse(res, err, controllerName, functionName);
    }
};

exports.getListeEmployeLibre = async (req, res) => {
    const functionName = "getListeEmployeLibre";

    try {
        verifyArgumentExistence(["idService", "dateHeureDebut"], req.body);

        const { idService, dateHeureDebut } = req.body;

        const dateDebut = new Date(dateHeureDebut);

        let service = await Servicedb.findOne({ _id: idService });
        const dateFin = new Date(dateDebut.getTime() + service.duree * 60000);
        // console.log("dateFin", dateFin);

        //to make sure that the emp can do the specific service
        //to make sure that the date of the service is inside of the emp workday
        //to make sure that the emp is not deleted
        var query = {
            mesServices: { $in: [new ObjectId(idService)] },
            "horaireTravail.jourTravail": { $in: [dateDebut.getDay()] },
            isDeleted: false,
        };

        //pour que l heure du service demande est dans l horaire de travail de l emp
        Employedb.aggregate([

            {
                $lookup: {
                    from: "horairetravails",
                    localField: "horaireTravail",
                    foreignField: "_id",
                    as: "horaireTravail"
                }
            },

            { $unwind: "$horaireTravail" },

            { $match: query },

            {
                $addFields: {
                    startTime: { $dateToString: { format: "%H:%M:%S", date: "$horaireTravail.debut" } },
                    endTime: { $dateToString: { format: "%H:%M:%S", date: "$horaireTravail.fin" } }
                }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $lte: ["$startTime", { $dateToString: { format: "%H:%M:%S", date: dateDebut } }] },
                            { $gte: ["$endTime", { $dateToString: { format: "%H:%M:%S", date: dateFin } }] }
                        ]
                    }
                }
            }
        ])
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
