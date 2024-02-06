const mongoose = require("mongoose");

const tacheeffectueeSchema = new mongoose.Schema({
  dateTache: {
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
});

tacheeffectueeSchema.set("timestamps", true); // ajoute created_at et upated_at
const Tacheeffectueedb = mongoose.model(
  "tacheeffectuee",
  tacheeffectueeSchema
);
module.exports = Tacheeffectueedb;
