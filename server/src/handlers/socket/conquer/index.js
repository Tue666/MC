const { roomBuilder } = require("../../../app/controllers/room/room.factory");
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
        mode,
        resource,
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

const onFindForming = (io, socket) => {
  socket.on("conquer:client-server(find-forming)", (data) => {
    try {
      const { mode, resource } = data;
      const roomFTR = roomBuilder(mode, resource);

      const rooms = roomFTR.findRooms();
      io.emit("conquer:server-client(forming)", Object.values(rooms));
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(find-forming)", error.message);
    }
  });
};

const onClientForming = (io, socket) => {
  socket.on("conquer:client-server(forming)", (data) => {
    try {
      const { mode, resource, room, client } = data;
      const roomFTR = roomBuilder(mode, resource);

      client.socketId = socket.id;
      const joinedRoom = roomFTR.joinRoom(room, client);

      io.to(socket.id).emit(
        "conquer:server-client(out-room-forming)",
        joinedRoom
      );

      // If client does not join the room because any reasons, stop
      if (joinedRoom.error) return;

      // Otherwise,
      // Inform all client that rooms have changed
      const rooms = roomFTR.findRooms();
      io.emit("conquer:server-client(forming)", Object.values(rooms));

      const { _id } = joinedRoom.room;

      // Client joins room so informs to all member in room
      if (room._id) {
        io.in(_id).emit(
          "conquer:server-client(in-room-forming)",
          joinedRoom.room
        );
      }

      socket.join(_id);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(forming)", error.message);
    }
  });
};

const onClientLeaveForming = (io, socket) => {
  socket.on("conquer:client-server(leave-forming)", (data) => {
    try {
      const { mode, resource, room, client } = data;
      const roomFTR = roomBuilder(mode, resource);

      const leftRoom = roomFTR.leaveRoom(room._id, client._id);

      // Inform all client that rooms have changed
      const rooms = roomFTR.findRooms();
      io.emit("conquer:server-client(forming)", Object.values(rooms));

      const { _id } = leftRoom;
      socket.leave(_id);

      io.in(_id).emit("conquer:server-client(in-room-forming)", leftRoom);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(leave-forming)", error.message);
    }
  });
};

const onClientStartForming = (io, socket) => {
  socket.on("conquer:client-server(start-forming)", (data) => {
    try {
      const { mode, resource, room } = data;
      const roomFTR = roomBuilder(mode, resource);

      roomFTR.updateRoom(room._id, {
        state: ROOM.STATE.preparing,
      });

      // Inform all client that rooms have changed
      const rooms = roomFTR.findRooms();
      io.emit("conquer:server-client(forming)", Object.values(rooms));

      io.in(room._id).emit("conquer:server-client(start-forming)", room);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(start-forming)", error.message);
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

      const { _id } = joinedRoom;
      socket.join(_id);

      if (roomFTR.isReadyToPrepare(_id)) {
        const roomWithNewState = roomFTR.updateRoom(_id, {
          state: ROOM.STATE.preparing,
        });

        io.in(_id).emit(
          "conquer:server-client(start-preparing)",
          roomWithNewState
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

      const { _id } = preparedRoom;

      if (roomFTR.isReadyToLoadingQuestion(_id)) {
        const roomWithNewState = roomFTR.updateRoom(_id, {
          state: ROOM.STATE.loading_question,
        });

        io.in(_id).emit(
          "conquer:server-client(start-loading-question)",
          roomWithNewState
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

      const resetRoom = roomFTR.prepareTimeout(room._id);

      if (resetRoom) {
        io.in(resetRoom._id).emit(
          "conquer:server-client(in-room-forming)",
          resetRoom
        );
      }
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

  onFindForming(io, socket);

  onClientForming(io, socket);

  onClientLeaveForming(io, socket);

  onClientStartForming(io, socket);

  onClientMatching(io, socket);

  onClientCancelMatching(io, socket);

  onClientPreparing(io, socket);

  onTimeoutPreparing(io, socket);

  quickMatchHandler(io, socket);

  disconnectingHandler(io, socket);
};
