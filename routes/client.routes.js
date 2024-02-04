const express = require("express");
const router = express.Router();
const ClientController = require("@controllers/client.controller");

const multer = require("multer");
const upload = multer();

router.get("/getClient/:id", ClientController.getClient);
router.get("/getListeClient", ClientController.getListeClient);
router.post("/addClient", upload.fields([{ name: 'file', maxCount: 1 }]), ClientController.addClient);
router.put("/updateClient/:id", upload.fields([{ name: 'file', maxCount: 1 }]), ClientController.updateClient);
router.delete("/deleteClient/:id", ClientController.deleteClient);

module.exports = router;