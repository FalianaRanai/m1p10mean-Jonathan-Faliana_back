const express = require("express");
const router = express.Router();
const ServiceController = require("@controllers/service.controller");

router.get("/getService/:id", ServiceController.getService);
router.get("/getListeService", ServiceController.getListeService);
router.post("/addService", ServiceController.addService);
router.put("/updateService/:id", ServiceController.updateService);
router.delete("/deleteService/:id", ServiceController.deleteService);

module.exports = router;