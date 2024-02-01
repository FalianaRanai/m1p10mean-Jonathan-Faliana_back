const express = require("express");
const router = express.Router();
const TacheeffectueeController = require("@controllers/tacheeffectuee.controller");

router.get("/getTacheeffectuee/:id", TacheeffectueeController.getTacheeffectuee);
router.get("/getListeTacheeffectuee", TacheeffectueeController.getListeTacheeffectuee);
router.post("/addTacheeffectuee", TacheeffectueeController.addTacheeffectuee);
router.put("/updateTacheeffectuee/:id", TacheeffectueeController.updateTacheeffectuee);
router.delete("/deleteTacheeffectuee/:id", TacheeffectueeController.deleteTacheeffectuee);

module.exports = router;