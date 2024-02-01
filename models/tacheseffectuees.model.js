const mongoose = require("mongoose");

const tacheseffectueesSchema = new mongoose.Schema({
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

tacheseffectueesSchema.set("timestamps", true); // ajoute created_at et upated_at
const Tacheseffectueesdb = mongoose.model(
  "tacheseffectuees",
  tacheseffectueesSchema
);
module.exports = Tacheseffectueesdb;
