const express = require("express");
const router = express.Router();
const TacheController = require("../controllers/tache.controller");
const EmployeController = require("../controllers/employe.controller");
const PaiementController = require("../controllers/paiement.controller");

router.get("/getReservationParMois", TacheController.getReservationParMois);
router.get("/getChiffreAffaireParMois", PaiementController.getChiffreAffaireParMois);
router.get("/getTempsMoyenEmploye/:id", EmployeController.getTempsMoyenEmploye);
router.post("/getReservationParJour", TacheController.getReservationParJour);
router.post("/getChiffreAffaireParJour", PaiementController.getChiffreAffaireParJour);

module.exports = router;