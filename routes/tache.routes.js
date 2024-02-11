const express = require("express");
const router = express.Router();
const TacheController = require("@controllers/tache.controller");

router.get("/getTache/:id", TacheController.getTache);
router.get("/getListeTache", TacheController.getListeTache);
router.get("/getTacheByEmp/:id", TacheController.getTacheByEmp);
router.post("/addTache", TacheController.addTache);
router.put("/updateTache/:id", TacheController.updateTache);
router.delete("/deleteTache/:id", TacheController.deleteTache);

module.exports = router;