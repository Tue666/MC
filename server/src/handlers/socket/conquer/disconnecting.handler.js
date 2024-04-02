const { roomBuilder } = require("../../../app/services/room/room.service");
const { ROOM } = require("../../../config/constant");

const onFormingDisconnecting = (io, socket, disconnection) => {
  const { room } = disconnection;

  const { _id } = room;

  io.in(_id).emit("conquer:server-client(in-room-forming)", room);
};

const onMatchingDisconnecting = (io, socket, disconnection) => {
  const { room, client } = disconnection;

  const { _id } = room;

  io.in(_id).emit("conquer:server-client(matching)", room, client);
};

const onPreparingDisconnecting = (io, socket, disconnection) => {
  const { room, client } = disconnection;

  const { _id } = room;

  io.in(_id).emit("conquer:server-client(preparing)", room, client);
};

const onLoadingQuestionDisconnecting = (io, socket, disconnection) => {
  const { originRoom, room, client } = disconnection;

  // Only the room owner can transfer loading question
  if (client._id !== originRoom.owner) return;

  const { owner, clients } = room;

  const newOwner = clients.find((client) => client._id === owner);
  io.to(newOwner.socketId).emit(
    "conquer:server-client(transfer-owner-loading)"
  );
};

const stateHandler = {
  [ROOM.STATE.forming]: onFormingDisconnecting,
  [ROOM.STATE.matching]: onMatchingDisconnecting,
  [ROOM.STATE.preparing]: onPreparingDisconnecting,
  [ROOM.STATE.loading_question]: onLoadingQuestionDisconnecting,
};

const roomHandler = (io, socket, disconnection) => {
  const { room } = disconnection;

  if (!stateHandler[room.state]) return;

  stateHandler[room.state](io, socket, disconnection);
};

module.exports = async (io, socket) => {
  const [socketId, roomId] = Array.from(socket.rooms);

  // Process for being in room only
  if (roomId) {
    const [mode, resource, _] = roomId.split(ROOM.ID_CONNECTOR);
    const roomService = roomBuilder(mode, resource);
    const disconnection = await roomService.disconnecting(roomId, socketId);

    roomHandler(io, socket, disconnection);
  }
};
