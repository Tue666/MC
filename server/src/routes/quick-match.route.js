const express = require("express");
const router = express.Router();

const {
  QuickMatchController,
} = require("../app/controllers/quick-match.controller");

router.post("/", QuickMatchController.create);
router.get("/:_id", QuickMatchController.findById);

module.exports = router;
