const express = require("express");
const router = express.Router();

const questionController = require("../app/controllers/question.controller");

router.post("/", questionController.insert);
router.get("/random", questionController.findByRandom);

module.exports = router;
