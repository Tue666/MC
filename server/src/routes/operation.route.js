const express = require("express");
const router = express.Router();

const {
  OperationController,
} = require("../app/controllers/operation.controller");

router.patch("/", OperationController.update);
router.post("/", OperationController.create);

module.exports = router;
