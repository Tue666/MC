const RoomController = require("../../../app/controllers/room.controller");

const onFindAllRoom = (io, socket) => {
  socket.on(
    "[TESTING]conquer:client-server(find-rooms-by-resource)",
    (resource) => {
      const rooms = RoomController.findRoomsByResource(resource);

      socket.emit(
        "[TESTING]conquer:server-client(find-rooms-by-resource)",
        rooms
      );
    }
  );
};

module.exports = (io, socket) => {
  onFindAllRoom(io, socket);
};
