const express = require("express");
const router = express.Router();

const { MatchController } = require("../app/controllers/match.controller");

router.post("/calculate-result", MatchController.calculateResult);
router.post("/", MatchController.create);

module.exports = router;
