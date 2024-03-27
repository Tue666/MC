const {
  SERVICES,
  roomBuilder,
} = require("../../../app/services/room/room.service");
const { ROOM } = require("../../../config/constant");

const onFormingConnect = (io, socket, connection) => {
  const { room } = connection;

  io.in(room._id).emit("conquer:server-client(in-room-forming)", room);
};

const stateHandler = {
  [ROOM.STATE.forming]: onFormingConnect,
};

const roomHandler = (io, socket, connection) => {
  const { room } = connection;
  socket.join(room._id);

  if (!stateHandler[room.state]) return;

  stateHandler[room.state](io, socket, connection);
};

const findRecoveryRoom = (clientId) => {
  const roomServices = SERVICES;

  for (let i = 0; i < Object.values(roomServices).length; i++) {
    const service = Object.values(roomServices)[i];

    const recovery = service.findRecoveryRoom(clientId);
    if (recovery) return recovery;
  }
};

const onRecoveryClient = (io, socket) => {
  socket.on("client-server(recovery-client)", async (clientId) => {
    try {
      const recovery = findRecoveryRoom(clientId);
      if (!recovery) return;

      const { mode, resource, room } = recovery;
      const roomService = roomBuilder(mode, resource);
      const roomHasClient = await roomService.connect(
        room,
        clientId,
        socket.id
      );
      if (!roomHasClient) return;

      const connection = { mode, resource, room: roomHasClient };

      roomHandler(io, socket, connection);

      socket.emit("server-client(recovery-client)", connection);
    } catch (error) {
      console.log(`[Error] Connecting:`, error.message);
    }
  });
};

module.exports = (io, socket) => {
  onRecoveryClient(io, socket);
};
