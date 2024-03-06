const express = require("express");
const router = express.Router();

const { RoleController } = require("../app/controllers/role.controller");

router.patch("/", RoleController.partialUpdate.bind(RoleController));
router.post("/_ids", RoleController.findByIds);
router.post("/", RoleController.create);

module.exports = router;
