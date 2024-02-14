const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/role.controller");

router.get("/getRole/:id", RoleController.getRole);
router.get("/getListeRole", RoleController.getListeRole);
router.post("/addRole", RoleController.addRole);
router.put("/updateRole/:id", RoleController.updateRole);
router.delete("/deleteRole/:id", RoleController.deleteRole);

module.exports = router;