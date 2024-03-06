const {
  roomBuilder,
} = require("../../../app/controllers/room/room-factory.controller");
const { ROOM } = require("../../../config/constant");

const onMatchingDisconnecting = (io, container) => {
  const { roomFTR, room, client } = container;

  const matchingRoom = roomFTR.leaveRoom(room._id, client._id);
  const { _id } = matchingRoom;

  io.in(_id).emit("conquer:server-client(matching)", matchingRoom, client);
};

const onPreparingDisconnecting = (io, container) => {
  const { roomFTR, room, client } = container;

  const preparingRoom = roomFTR.updateClient(room._id, {
    ...client,
    state: ROOM.CLIENT_STATE.disconnect,
    prepared: false,
  });
  const { _id } = preparingRoom;

  io.in(_id).emit("conquer:server-client(preparing)", preparingRoom, client);
};

const onLoadingQuestionDisconnecting = (io, container) => {
  const { roomFTR, room, client } = container;

  const loadingRoom = roomFTR.updateClient(room._id, {
    ...client,
    state: ROOM.CLIENT_STATE.disconnect,
  });

  if (room.owner !== client._id) return;

  const { clients } = loadingRoom;
  const connectClients = clients.filter(
    (client) => client.state === ROOM.CLIENT_STATE.connect
  );
  if (!connectClients.length) {
    roomFTR.deleteRoom(room._id);
    return;
  }

  const newOwner = connectClients[0];
  io.to(newOwner.socketId).emit(
    "conquer:server-client(transfer-owner-loading)"
  );
};

const onPlayingDisconnecting = (io, container) => {
  const { roomFTR, room, client } = container;

  const playingRoom = roomFTR.updateClient(room._id, {
    ...client,
    state: ROOM.CLIENT_STATE.disconnect,
  });

  const { clients } = playingRoom;
  const allClientDisconnect = clients.every(
    (client) => client.state === ROOM.CLIENT_STATE.disconnect
  );
  if (!allClientDisconnect) return;

  roomFTR.deleteRoom(room._id);
};

const stateHandler = {
  [ROOM.STATE.matching]: onMatchingDisconnecting,
  [ROOM.STATE.preparing]: onPreparingDisconnecting,
  [ROOM.STATE.loading_question]: onLoadingQuestionDisconnecting,
  [ROOM.STATE.playing]: onPlayingDisconnecting,
};

const roomHandler = (io, container) => {
  const { room } = container;

  if (stateHandler[room.state]) stateHandler[room.state](io, container);
};

module.exports = (io, socket) => {
  socket.on("disconnecting", () => {
    try {
      const [socketId, roomId] = Array.from(socket.rooms);

      // Process for being in room only
      if (roomId) {
        const [mode, resource, _] = roomId.split(ROOM.ID_CONNECTOR);
        const roomFTR = roomBuilder(mode, resource);
        const container = roomFTR.findBySocket(roomId, socketId);

        if (container) {
          roomHandler(io, { roomFTR, ...container });
        }
      }
    } catch (error) {
      console.log(`[Error] Disconnecting:`, error.message);
    }
  });
};
