const RoomController = require("../../../app/controllers/room.controller");
const testingHandler = require("./testing.handler");
const quickMatchHandler = require("./quick-match.handler");

const onClientParticipating = (io, socket) => {
  socket.on("conquer:client-server(participating)", (data) => {
    try {
      const { room, client } = data;

      const joinedRoom = RoomController.joinPublicRoom(room, client);
      const { _id, maxCapacity, clients } = joinedRoom;

      socket.join(_id);

      if (clients.length >= maxCapacity) {
        io.in(_id).emit(
          "conquer:server-client(prepare-participate)",
          joinedRoom
        );
        return;
      }

      io.in(_id).emit("conquer:server-client(participating)", joinedRoom);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(participating)", error.message);
    }
  });
};

const onClientCancelParticipating = (io, socket) => {
  socket.on("conquer:client-server(cancel-participating)", (data) => {
    try {
      const { room, client } = data;

      const leftRoom = RoomController.leavePublicRoom(room, client);
      const { _id } = leftRoom;

      io.in(_id).emit("conquer:server-client(participating)", leftRoom);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(cancel-participating)",
        error.message
      );
    }
  });
};

const onClientPrepareParticipate = (io, socket) => {
  socket.on("conquer:client-server(prepare-participate)", (data) => {
    try {
      const { room, client } = data;

      const preparedRoom = RoomController.preparedRoom(room, client);
      const { _id, clients } = preparedRoom;

      const allClientPrepared = clients.every((client) => client.prepared);
      if (allClientPrepared) {
        io.in(_id).emit(
          "conquer:server-client(start-participate)",
          preparedRoom
        );
        return;
      }

      io.in(_id).emit(
        "conquer:server-client(prepare-participate)",
        preparedRoom
      );
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(prepare-participate)",
        error.message
      );
    }
  });
};

module.exports = (io, socket) => {
  onClientParticipating(io, socket);

  onClientCancelParticipating(io, socket);

  onClientPrepareParticipate(io, socket);

  testingHandler(io, socket);

  quickMatchHandler(io, socket);
};
