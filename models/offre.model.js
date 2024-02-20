const mongoose = require("mongoose");

const offreSchema = new mongoose.Schema({
    nomOffre: {
        type: String,
        required: true
    },
    dateDebut:{
      type: Date,
      required: true
    },
    dateFin:{
      type: Date,
      required: true
    },
    service:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "service"
    },
    remise:{
      type: Number,
      required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

offreSchema.set("timestamps", true); // ajoute created_at et upated_at
const Offredb = mongoose.model("offre", offreSchema);
module.exports = Offredb;
