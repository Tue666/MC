const express = require("express");
const router = express.Router();

const {
  OperationController,
} = require("../app/controllers/operation.controller");

router.patch("/", OperationController.partialUpdate.bind(OperationController));
router.post("/", OperationController.create);

module.exports = router;
