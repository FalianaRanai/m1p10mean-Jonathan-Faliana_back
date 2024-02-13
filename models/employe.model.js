const mongoose = require("mongoose");

const horaireTravailSchema = new mongoose.Schema({
    debut: {
        type: Date,
        required: true
    },
    fin: {
        type: Date,
        required: true
    },
    jourTravail: {
        type: [mongoose.Schema.Types.Number],
        required: true
    }
});


const employeSchema = new mongoose.Schema({
    nomEmploye: {
        type: String,
        required: true,
    },
    prenomEmploye: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    listeTaches: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "tache",
    },
    image: {
        type: String,
        default: "default.webp",
    },
    mesServices: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "service",
    },
    horaireTravail: {
        type: horaireTravailSchema,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

employeSchema.set("timestamps", true); // ajoute created_at et upated_at
const Employedb = mongoose.model("employe", employeSchema);
module.exports = Employedb;
