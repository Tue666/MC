const express = require("express");
const router = express.Router();

const {
  ResourceController,
} = require("../app/controllers/resource.controller");

router.patch("/", ResourceController.partialUpdate.bind(ResourceController));
router.post("/", ResourceController.create);

module.exports = router;
