const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    nomService: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    duree: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    }
});

serviceSchema.set("timestamps", true); // ajoute created_at et upated_at
const Servicedb = mongoose.model("service", serviceSchema);
module.exports = Servicedb;
