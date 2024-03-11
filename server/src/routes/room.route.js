const express = require("express");
const router = express.Router();

const { RoomController } = require("../app/controllers/room.controller");

router.post("/", RoomController.find);

module.exports = router;
