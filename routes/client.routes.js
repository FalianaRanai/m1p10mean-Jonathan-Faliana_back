const express = require("express");
const router = express.Router();
const ClientController = require("@controllers/client.controller");

router.get("/getClient/:id", ClientController.getClient);
router.get("/getListeClient", ClientController.getListeClient);
router.post("/addClient", ClientController.addClient);
router.put("/updateClient/:id", ClientController.updateClient);
router.delete("/deleteClient/:id", ClientController.deleteClient);

module.exports = router;