const express = require("express");
const router = express.Router();
const EmployeController = require("@controllers/employe.controller");

const multer = require("multer");
const upload = multer();

router.get("/getEmploye/:id", EmployeController.getEmploye);
router.get("/getListeEmploye", EmployeController.getListeEmploye);
router.post("/addEmploye", upload.fields([{ name: 'file', maxCount: 1 }]), EmployeController.addEmploye);
router.put("/updateEmploye/:id", upload.fields([{ name: 'file', maxCount: 1 }]), EmployeController.updateEmploye);
router.delete("/deleteEmploye/:id", EmployeController.deleteEmploye);

module.exports = router;