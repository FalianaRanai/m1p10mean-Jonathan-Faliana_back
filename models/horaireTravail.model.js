const mongoose = require("mongoose");

const horaireTravailSchema = new mongoose.Schema({
  debut: {
      type: Date,
      required: true
  },
  fin: {
      type: Date,
      required: true
  },
  jourTravail: {
      type: [mongoose.Schema.Types.Number],
      required: true
  }
});

horaireTravailSchema.set("timestamps", true); // ajoute created_at et upated_at
const HoraireTravaildb = mongoose.model("horaireTravail", horaireTravailSchema);
module.exports = HoraireTravaildb;