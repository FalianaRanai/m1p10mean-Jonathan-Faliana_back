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
    description:{
        type: String,
        required: true,
        default: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry"
    },
    image: {
        type: String,
        default: "default.webp"
    },
    icone: {
        type: String
    }
});

serviceSchema.set("timestamps", true); // ajoute created_at et upated_at
const Servicedb = mongoose.model("service", serviceSchema);
module.exports = Servicedb;
