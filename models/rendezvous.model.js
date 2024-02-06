const mongoose = require("mongoose");

const rendezvousSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "client"
    },
    dateRdv: {
        type: Date,
        required: true
    },
    listeEmployes: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "employe"
    },
    listeServices: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "service"
    },
    listeTaches:{
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "tache"
    }
});

rendezvousSchema.set("timestamps", true); // ajoute created_at et upated_at
const Rendezvousdb = mongoose.model("rendezvous", rendezvousSchema);
module.exports = Rendezvousdb;
