const express = require("express");
const router = express.Router();
const OffreController = require("../controllers/offre.controller");

router.get("/getOffre/:id", OffreController.getOffre);
router.get("/getListeOffre", OffreController.getListeOffre);
router.post("/addOffre", OffreController.addOffre);
router.put("/updateOffre/:id", OffreController.updateOffre);
router.delete("/deleteOffre/:id", OffreController.deleteOffre);

module.exports = router;