const mongoose = require("mongoose");

const statutSchema = new mongoose.Schema({
    nomStatut: {
        type: String,
        required: true
    },
});

statutSchema.set("timestamps", true); // ajoute created_at et upated_at
const Statutdb = mongoose.model("statut", statutSchema);
module.exports = Statutdb;
