const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/client.controller");

const multer = require("multer");
const upload = multer();

router.get("/getClient/:id", ClientController.getClient);
router.get("/getListeClient", ClientController.getListeClient);
router.get("/getRappelRendezVous/:client", ClientController.getRappelRendezVous);
router.put("/savePreference/:id", ClientController.savePreference);
router.post("/addClient", upload.fields([{ name: 'file', maxCount: 1 }]), ClientController.addClient);
router.put("/updateClient/:id", upload.fields([{ name: 'file', maxCount: 1 }]), ClientController.updateClient);
router.delete("/deleteClient/:id", ClientController.deleteClient);
router.get("/generateData/:length", ClientController.generateData);

module.exports = router;