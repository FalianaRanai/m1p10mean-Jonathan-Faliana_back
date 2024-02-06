const express = require("express");
const router = express.Router();
const UserController = require("@controllers/user.controller");

router.get("/getUser/:id", UserController.getUser);
router.get("/getListeUser", UserController.getListeUser);
router.post("/addUser", UserController.addUser);
router.put("/updateUser/:id", UserController.updateUser);
router.delete("/deleteUser/:id", UserController.deleteUser);
router.post("/login", UserController.login);
router.post("/verifyUserToken", UserController.verifyUserToken);
router.post("/logout", UserController.logout);
router.delete("/deleteUserToken/:token", UserController.deleteUserToken);

module.exports = router;