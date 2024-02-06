const express = require("express");
const router = express.Router();
const UserTokenController = require("@controllers/userToken.controller");

router.get("/getUserToken/:id", UserTokenController.getUserToken);
router.get("/getListeUserToken", UserTokenController.getListeUserToken);
router.post("/addUserToken", UserTokenController.addUserToken);
router.put("/updateUserToken/:id", UserTokenController.updateUserToken);
router.delete("/deleteUserToken/:id", UserTokenController.deleteUserToken);

module.exports = router;