const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    nomRole: {
        type: String,
        required: true
    }
});

roleSchema.set("timestamps", true); // ajoute created_at et upated_at
const Roledb = mongoose.model("role", roleSchema);
module.exports = Roledb;
