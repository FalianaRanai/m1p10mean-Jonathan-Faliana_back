const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
    nomManager: {
        type: String,
        required: true,
    },
    prenomManager: {
      type: String,
      required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
});

managerSchema.set("timestamps", true); // ajoute created_at et upated_at
const Managerdb = mongoose.model("manager", managerSchema);
module.exports = Managerdb;
