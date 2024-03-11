const { roomBuilder } = require("../../../app/controllers/room/room.factory");
const { ROOM } = require("../../../config/constant");

const onFormingDisconnecting = (io, socket, disconnect) => {
  const { room } = disconnect;

  const { _id } = room;

  io.in(_id).emit("conquer:server-client(in-room-forming)", room);
};

const onMatchingDisconnecting = (io, socket, disconnect) => {
  const { room, client } = disconnect;

  const { _id } = room;

  io.in(_id).emit("conquer:server-client(matching)", room, client);
};

const onPreparingDisconnecting = (io, socket, disconnect) => {
  const { room, client } = disconnect;

  const { _id } = room;

  io.in(_id).emit("conquer:server-client(preparing)", room, client);
};

const onLoadingQuestionDisconnecting = (io, socket, container) => {
  const { originRoom, room, client } = container;

  // Only the room owner can transfer loading question
  if (client._id !== originRoom.owner) return;

  const { owner, clients } = room;

  const newOwner = clients.find((client) => client._id === owner);
  io.to(newOwner.socketId).emit(
    "conquer:server-client(transfer-owner-loading)"
  );
};

const onPlayingDisconnecting = (io, socket, container) => {};

const stateHandler = {
  [ROOM.STATE.forming]: onFormingDisconnecting,
  [ROOM.STATE.matching]: onMatchingDisconnecting,
  [ROOM.STATE.preparing]: onPreparingDisconnecting,
  [ROOM.STATE.loading_question]: onLoadingQuestionDisconnecting,
  [ROOM.STATE.playing]: onPlayingDisconnecting,
};

const roomHandler = (io, socket, disconnect) => {
  const { room } = disconnect;

  if (stateHandler[room.state])
    stateHandler[room.state](io, socket, disconnect);
};

module.exports = (io, socket) => {
  socket.on("disconnecting", () => {
    try {
      const [socketId, roomId] = Array.from(socket.rooms);

      // Process for being in room only
      if (roomId) {
        const [mode, resource, _] = roomId.split(ROOM.ID_CONNECTOR);
        const roomFTR = roomBuilder(mode, resource);
        const disconnect = roomFTR.disconnecting(roomId, socketId);

        roomHandler(io, socket, { roomFTR, ...disconnect });
      }
    } catch (error) {
      console.log(`[Error] Disconnecting:`, error.message);
    }
  });
};
