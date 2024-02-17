const express = require("express");
const router = express.Router();

const operationController = require("../app/controllers/operation.controller");

router.patch("/status", operationController.changeStatus);
router.post("/", operationController.insert);

module.exports = router;
