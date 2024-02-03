const express = require("express");
const router = express.Router();
const ServiceController = require("@controllers/service.controller");

const multer = require("multer");
const upload = multer();

router.get("/getService/:id", ServiceController.getService);
router.get("/getListeService", ServiceController.getListeService);
router.post("/addService", upload.fields([{ name: 'file', maxCount: 1 }]), ServiceController.addService);
router.put("/updateService/:id", upload.fields([{ name: 'file', maxCount: 1 }]), ServiceController.updateService);
router.delete("/deleteService/:id", ServiceController.deleteService);

module.exports = router;