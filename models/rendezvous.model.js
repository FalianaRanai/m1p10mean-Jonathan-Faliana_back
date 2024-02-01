const mongoose = require("mongoose");

const rendezvousSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "client"
    },
    employe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "employe"
    },
    dateRdv: {
        type: Date,
        required: true
    },
    listeServices: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "service"
    },
    statut: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "statut"
    }
});

rendezvousSchema.set("timestamps", true); // ajoute created_at et upated_at
const Rendezvousdb = mongoose.model("rendezvous", rendezvousSchema);
module.exports = Rendezvousdb;
