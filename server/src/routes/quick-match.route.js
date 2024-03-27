const express = require("express");
const router = express.Router();

const {
  QuickMatchController,
} = require("../app/controllers/quick-match.controller");

router.post("/", QuickMatchController.create);

module.exports = router;
