const express = require("express");
const router = express.Router();
const TacheController = require("../controllers/tache.controller");
const EmployeController = require("../controllers/employe.controller");

router.get("/getReservationParMois", TacheController.getReservationParMois);
router.get("/getTempsMoyenEmploye/:id", EmployeController.getTempsMoyenEmploye);
router.post("/getReservationParJour", TacheController.getReservationParJour);

module.exports = router;