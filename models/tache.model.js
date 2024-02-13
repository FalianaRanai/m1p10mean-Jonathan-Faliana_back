const mongoose = require("mongoose");

const tacheSchema = new mongoose.Schema({
    dateDebut: {
        type: Date,
        required: true,
    },
    dateFin: {
        type: Date,
        required: true,
    },
    employe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "employe",
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "service",
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "client",
    },
    statut: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "statut",
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

tacheSchema.set("timestamps", true); // ajoute created_at et upated_at
const Tachedb = mongoose.model(
    "tache",
    tacheSchema
);
module.exports = Tachedb;
