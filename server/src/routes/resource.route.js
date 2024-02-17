const express = require("express");
const router = express.Router();

const resourceController = require("../app/controllers/resource.controller");

router.patch("/status", resourceController.changeStatus);
router.post("/", resourceController.insert);

module.exports = router;
