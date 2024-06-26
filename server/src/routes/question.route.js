const express = require("express");
const router = express.Router();

const {
  QuestionController,
} = require("../app/controllers/question.controller");

router.post("/random", QuestionController.findByRandom);
router.post("/", QuestionController.create);

module.exports = router;
