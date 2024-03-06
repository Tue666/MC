const {
  roomBuilder,
} = require("../../../app/controllers/room/room-factory.controller");
const { ROOM } = require("../../../config/constant");
const quickMatchHandler = require("./quick-match.handler");
const disconnectingHandler = require("./disconnecting.handler");

const onFindRooms = (io, socket) => {
  socket.on("[TESTING]conquer:client-server(find-rooms)", (data) => {
    try {
      const { mode, resource } = data;
      const roomFTR = roomBuilder(mode, resource);

      const rooms = roomFTR.findRooms();

      io.to(socket.id).emit(
        "[TESTING]conquer:server-client(find-rooms)",
        rooms
      );
    } catch (error) {
      socket.emit(
        "[ERROR][TESTING]conquer:server-client(find-rooms)",
        error.message
      );
    }
  });
};

const onClientMatching = (io, socket) => {
  socket.on("conquer:client-server(matching)", (data) => {
    try {
      const { mode, resource, room, client } = data;
      const roomFTR = roomBuilder(mode, resource);

      client.socketId = socket.id;
      const joinedRoom = roomFTR.joinRoom(room, client);
      const { _id, maxCapacity, clients } = joinedRoom;

      socket.join(_id);

      if (clients.length >= maxCapacity) {
        io.in(_id).emit(
          "conquer:server-client(start-preparing)",
          roomFTR.updateRoom(_id, {
            state: ROOM.STATE.preparing,
          })
        );
        return;
      }

      io.in(_id).emit("conquer:server-client(matching)", joinedRoom, client);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(matching)", error.message);
    }
  });
};

const onClientCancelMatching = (io, socket) => {
  socket.on("conquer:client-server(cancel-matching)", (data) => {
    try {
      const { mode, resource, room, client } = data;
      const roomFTR = roomBuilder(mode, resource);

      const leftRoom = roomFTR.leaveRoom(room._id, client._id);
      const { _id } = leftRoom;

      io.in(_id).emit("conquer:server-client(matching)", leftRoom, client);

      socket.leave(_id);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(cancel-matching)",
        error.message
      );
    }
  });
};

const onClientPreparing = (io, socket) => {
  socket.on("conquer:client-server(preparing)", (data) => {
    try {
      const { mode, resource, room, client } = data;
      const roomFTR = roomBuilder(mode, resource);

      const preparedRoom = roomFTR.prepareRoom(room._id, client);
      const { _id, clients } = preparedRoom;

      const allClientPrepared = clients.every((client) => client.prepared);
      if (allClientPrepared) {
        io.in(_id).emit(
          "conquer:server-client(start-loading-question)",
          roomFTR.updateRoom(_id, {
            state: ROOM.STATE.loading_question,
          })
        );
        return;
      }

      io.in(_id).emit("conquer:server-client(preparing)", preparedRoom, client);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(preparing)", error.message);
    }
  });
};

const onTimeoutPreparing = (io, socket) => {
  socket.on("conquer:client-server(timeout-preparing)", (data) => {
    try {
      const { mode, resource, room } = data;
      const roomFTR = roomBuilder(mode, resource);

      roomFTR.deleteRoom(room._id);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(timeout-preparing)",
        error.message
      );
    }
  });
};

module.exports = (io, socket) => {
  onFindRooms(io, socket);

  onClientMatching(io, socket);

  onClientCancelMatching(io, socket);

  onClientPreparing(io, socket);

  onTimeoutPreparing(io, socket);

  quickMatchHandler(io, socket);

  disconnectingHandler(io, socket);
};
