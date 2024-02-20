const express = require("express");
const router = express.Router();
const TacheController = require("../controllers/tache.controller");
const EmployeController = require("../controllers/employe.controller");
const PaiementController = require("../controllers/paiement.controller");
const RendezvousController = require("../controllers/rendezvous.controller");

router.get("/getReservationParMois", TacheController.getReservationParMois);
router.get("/getRdvReservationParMois", RendezvousController.getRdvReservationParMois);
router.get("/getRdvReservationParJour", RendezvousController.getRdvReservationParJour);
router.get("/getChiffreAffaireParMois", PaiementController.getChiffreAffaireParMois);
router.get("/getTempsMoyenEmploye/:id", EmployeController.getTempsMoyenEmploye);
router.post("/getReservationParJour", TacheController.getReservationParJour);
router.get("/getChiffreAffaireParJour", PaiementController.getChiffreAffaireParJour);

module.exports = router; 