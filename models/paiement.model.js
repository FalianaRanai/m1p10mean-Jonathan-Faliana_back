const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema({
    nomSurCarte: {
        type: String,
        required: true,
    },
    numeroCarte: {
        type: String,
        required: true
    },
    cvv: {
        type: Number,
        required: true
    },
    dateExpiration: {
        type: String,
        required: true,
    },
    montant: {
        type: Number,
        required: true,
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
});

paiementSchema.set("timestamps", true); // ajoute created_at et upated_at
const Paiementdb = mongoose.model("paiement", paiementSchema);
module.exports = Paiementdb;
