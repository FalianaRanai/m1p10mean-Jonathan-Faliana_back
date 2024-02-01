const express = require("express");
const router = express.Router();
const ManagerController = require("@controllers/manager.controller");

router.get("/getManager/:id", ManagerController.getManager);
router.get("/getListeManager", ManagerController.getListeManager);
router.post("/addManager", ManagerController.addManager);
router.put("/updateManager/:id", ManagerController.updateManager);
router.delete("/deleteManager/:id", ManagerController.deleteManager);

module.exports = router;