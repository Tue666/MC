const { roomBuilder } = require("./room/room.factory");

class RoomController {
  async find(req, res, next) {
    try {
      const { mode, resource } = req.body;
      const roomFTR = roomBuilder(mode, resource);

      const rooms = roomFTR.findRooms();

      res.status(201).json({
        rooms: Object.values(rooms),
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = {
  RoomController: new RoomController(),
};
