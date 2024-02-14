const express = require("express");
const router = express.Router();
const ManagerController = require("../controllers/manager.controller");

const multer = require("multer");
const upload = multer();

router.get("/getManager/:id", ManagerController.getManager);
router.get("/getListeManager", ManagerController.getListeManager);
router.post("/addManager", upload.fields([{ name: 'file', maxCount: 1 }]), ManagerController.addManager);
router.put("/updateManager/:id", upload.fields([{ name: 'file', maxCount: 1 }]), ManagerController.updateManager);
router.delete("/deleteManager/:id", ManagerController.deleteManager);

module.exports = router;