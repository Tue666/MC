const express = require("express");
const router = express.Router();

const roleController = require("../app/controllers/role.controller");

router.patch("/status", roleController.changeStatus);
router.post("/_ids", roleController.findByIds);
router.post("/", roleController.insert);

module.exports = router;
