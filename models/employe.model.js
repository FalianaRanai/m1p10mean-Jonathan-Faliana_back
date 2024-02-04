const mongoose = require("mongoose");

const employeSchema = new mongoose.Schema({
  nomEmploye: {
    type: String,
    required: true,
  },
  prenomEmploye: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  listeTachesEffectuees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "tacheeffectuee",
  },
  image: {
    type: String,
    default: "default.webp",
  },
});

employeSchema.set("timestamps", true); // ajoute created_at et upated_at
const Employedb = mongoose.model("employe", employeSchema);
module.exports = Employedb;
