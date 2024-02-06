const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true
    },
    expired_at: {
        type: Date,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

userTokenSchema.set("timestamps", true); // ajoute created_at et upated_at
const UserTokendb = mongoose.model("userToken", userTokenSchema);
module.exports = UserTokendb;
