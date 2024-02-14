const express = require("express");
const router = express.Router();
const RendezvousController = require("../controllers/rendezvous.controller");

router.get("/getRendezvous/:id", RendezvousController.getRendezvous);
router.get("/getListeRdvParClient/:id", RendezvousController.getListeRdvParClient);
router.get("/getListeRendezvous", RendezvousController.getListeRendezvous);
router.post("/addRendezvous", RendezvousController.addRendezvous);
router.put("/updateRendezvous/:id", RendezvousController.updateRendezvous);
router.delete("/deleteRendezvous/:id", RendezvousController.deleteRendezvous);

module.exports = router;