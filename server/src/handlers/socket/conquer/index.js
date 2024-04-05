const { roomBuilder } = require("../../../app/services/room/room.service");
const {
  ConversationService,
} = require("../../../app/services/conversation.service");
const { ROOM } = require("../../../config/constant");
const quickMatchHandler = require("./quick-match.handler");

// #region TESTING
const handleFindRooms = (io, socket, data) => {
  const { mode, resource, query } = data;
  const roomService = roomBuilder(mode, resource);

  const rooms = roomService.findRooms(query);

  io.to(socket.id).emit(
    "[TESTING]conquer:server-client(find-rooms)",
    mode,
    resource,
    rooms
  );
};
const onFindRooms = (io, socket) => {
  socket.on("[TESTING]conquer:client-server(find-rooms)", (data) => {
    try {
      handleFindRooms(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR][TESTING]conquer:server-client(find-rooms)",
        error.message
      );
    }
  });
};
// #endregion

const informRoomChanged = (io, mode, resource) => {
  const roomService = roomBuilder(mode, resource);

  const query = (room) => room.state === ROOM.STATE.forming;
  const rooms = roomService.findRooms(query);
  io.emit("conquer:server-client(forming)", Object.values(rooms));
};

const resetGamePlay = (io, socket, mode, resource, room, resetRoom) => {
  if (resetRoom) {
    // Inform all client that rooms have changed
    informRoomChanged(io, mode, resource);

    io.in(resetRoom._id).emit(
      "conquer:server-client(in-room-forming)",
      resetRoom
    );
  } else {
    io.in(room.conversationId).emit(
      "conversation:server-client(clear-conversation)",
      room.conversationId
    );
    socket.leave(room.conversationId);
    socket.leave(room._id);
  }
};

const joinConversation = (joinedRoom, client) => {
  const { _id, name, conversationId } = joinedRoom;

  const conversation = {
    title: name || _id,
  };

  // Client join room which already had conversation
  if (conversationId) {
    conversation["_id"] = conversationId;
  }

  const joinedConversation = ConversationService.joinConversation(
    conversation,
    client
  );

  return joinedConversation;
};

const leaveConversation = (conversationId, clientId) => {
  const leftConversation = ConversationService.leaveConversation(
    conversationId,
    clientId
  );

  return leftConversation;
};

const handleFindForming = (io, socket, data) => {
  const { mode, resource } = data;

  informRoomChanged(io, mode, resource);
};
const onFindForming = (io, socket) => {
  socket.on("conquer:client-server(find-forming)", (data) => {
    try {
      handleFindForming(io, socket, data);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(find-forming)", error.message);
    }
  });
};

const handleRefreshForming = (io, socket, data) => {
  const { mode, resource } = data;
  const roomService = roomBuilder(mode, resource);

  const query = (room) => room.state === ROOM.STATE.forming;
  const rooms = roomService.findRooms(query);
  io.to(socket.id).emit("conquer:server-client(forming)", Object.values(rooms));
};
const onRefreshForming = (io, socket) => {
  socket.on("conquer:client-server(refresh-forming)", (data) => {
    try {
      handleRefreshForming(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(refresh-forming)",
        error.message
      );
    }
  });
};

const handleClientForming = (io, socket, data) => {
  const { mode, resource, room, client } = data;
  const roomService = roomBuilder(mode, resource);

  client.socketId = socket.id;
  const result = roomService.joinRoom(room, client);
  const { room: joinedRoom, error } = result;

  if (error) {
    // If client does not join the room because any reasons, stop
    io.to(socket.id).emit(
      "conquer:server-client(out-room-forming-error)",
      result
    );
    return;
  }

  const { _id: joinedRoomId, conversationId } = joinedRoom;
  socket.join(joinedRoomId);

  // Otherwise,
  // Join conversation
  const joinedConversation = joinConversation(joinedRoom, client);

  const { _id: joinedConversationId } = joinedConversation;
  socket.join(joinedConversationId);

  if (!conversationId) {
    roomService.updateRoom(joinedRoomId, {
      conversationId: joinedConversationId,
    });
    joinedRoom.conversationId = joinedConversationId;
  }

  io.in(joinedConversationId).emit(
    "conversation:server-client(join-conversation)",
    joinedConversation,
    client
  );

  // Inform client that joined the room
  io.to(socket.id).emit("conquer:server-client(out-room-forming)", joinedRoom);

  // Inform all member already in room
  io.in(joinedRoomId)
    .except(socket.id)
    .emit("conquer:server-client(in-room-forming)", joinedRoom);

  // Inform all client that rooms have changed
  informRoomChanged(io, mode, resource);
};
const onClientForming = (io, socket) => {
  socket.on("conquer:client-server(forming)", async (data) => {
    try {
      handleClientForming(io, socket, data);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(forming)", error.message);
    }
  });
};

const handleClientLeaveForming = (io, socket, data) => {
  const { mode, resource, room, client } = data;
  const roomService = roomBuilder(mode, resource);

  // Leave conversation
  const leftConversation = leaveConversation(room.conversationId, client._id);

  const { _id: leftConversationId } = leftConversation;

  io.in(leftConversationId).emit(
    "conversation:server-client(leave-conversation)",
    leftConversation,
    client
  );

  socket.leave(leftConversationId);

  const leftRoom = roomService.leaveRoom(room._id, client._id);

  // Inform all client that rooms have changed
  informRoomChanged(io, mode, resource);

  const { _id: leftRoomId } = leftRoom;
  socket.leave(leftRoomId);

  io.in(leftRoomId).emit("conquer:server-client(in-room-forming)", leftRoom);
};
const onClientLeaveForming = (io, socket) => {
  socket.on("conquer:client-server(leave-forming)", (data) => {
    try {
      handleClientLeaveForming(io, socket, data);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(leave-forming)", error.message);
    }
  });
};

const handleClientTransferOwnerForming = (io, socket, data) => {
  const { mode, resource, room, newOwner } = data;
  const roomService = roomBuilder(mode, resource);

  const roomWithNewOwner = roomService.transferRoomOwner(
    room._id,
    newOwner._id
  );

  // Inform all client that rooms have changed
  informRoomChanged(io, mode, resource);

  io.in(roomWithNewOwner._id).emit(
    "conquer:server-client(in-room-forming)",
    roomWithNewOwner
  );
};
const onClientTransferOwnerForming = (io, socket) => {
  socket.on("conquer:client-server(transfer-owner-forming)", (data) => {
    try {
      handleClientTransferOwnerForming(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(transfer-owner-forming)",
        error.message
      );
    }
  });
};

const handleClientRemoveClientForming = (io, socket, data) => {
  const { client } = data;
  const clientSocketId = client.socketId;
  const clientSocket = io.sockets.sockets.get(clientSocketId);

  io.to(clientSocketId).emit("conquer:server-client(removed-from-forming)");

  if (clientSocket) {
    handleClientLeaveForming(io, clientSocket, data);
  }
};
const onClientRemoveClientForming = (io, socket) => {
  socket.on("conquer:client-server(remove-client-forming)", (data) => {
    try {
      handleClientRemoveClientForming(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(remove-client-forming)",
        error.message
      );
    }
  });
};

const handleClientStartForming = (io, socket, data) => {
  const { mode, resource, room } = data;
  const roomService = roomBuilder(mode, resource);

  roomService.updateRoom(room._id, {
    state: ROOM.STATE.preparing,
  });

  // Inform all client that rooms have changed
  informRoomChanged(io, mode, resource);

  io.in(room._id).emit("conquer:server-client(start-forming)", room);
};
const onClientStartForming = (io, socket) => {
  socket.on("conquer:client-server(start-forming)", (data) => {
    try {
      handleClientStartForming(io, socket, data);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(start-forming)", error.message);
    }
  });
};

const handleClientMatching = (io, socket, data) => {
  const { mode, resource, room, client } = data;
  const roomService = roomBuilder(mode, resource);

  client.socketId = socket.id;
  const joinedRoom = roomService.joinRoom(room, client);

  const { _id: joinedRoomId, conversationId } = joinedRoom;
  socket.join(joinedRoomId);

  // Join conversation
  const joinedConversation = joinConversation(joinedRoom, client);

  const { _id: joinedConversationId } = joinedConversation;
  socket.join(joinedConversationId);

  if (!conversationId) {
    roomService.updateRoom(joinedRoomId, {
      conversationId: joinedConversationId,
    });
    joinedRoom.conversationId = joinedConversationId;
  }

  io.in(joinedConversationId).emit(
    "conversation:server-client(join-conversation)",
    joinedConversation,
    client
  );

  if (roomService.isReadyToPrepare(joinedRoomId)) {
    const roomWithNewState = roomService.updateRoom(joinedRoomId, {
      state: ROOM.STATE.preparing,
    });

    io.in(joinedRoomId).emit(
      "conquer:server-client(start-preparing)",
      roomWithNewState
    );
    return;
  }

  io.in(joinedRoomId).emit(
    "conquer:server-client(matching)",
    joinedRoom,
    client
  );
};
const onClientMatching = (io, socket) => {
  socket.on("conquer:client-server(matching)", (data) => {
    try {
      handleClientMatching(io, socket, data);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(matching)", error.message);
    }
  });
};

const handleClientCancelMatching = (io, socket, data) => {
  const { mode, resource, room, client } = data;
  const roomService = roomBuilder(mode, resource);

  // Leave conversation
  const leftConversation = leaveConversation(room.conversationId, client._id);

  const { _id: leftConversationId } = leftConversation;

  io.in(leftConversationId).emit(
    "conversation:server-client(leave-conversation)",
    leftConversation,
    client
  );

  socket.leave(leftConversationId);

  const leftRoom = roomService.leaveRoom(room._id, client._id);

  const { _id } = leftRoom;

  io.in(_id).emit("conquer:server-client(matching)", leftRoom, client);

  socket.leave(_id);
};
const onClientCancelMatching = (io, socket) => {
  socket.on("conquer:client-server(cancel-matching)", (data) => {
    try {
      handleClientCancelMatching(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer:server-client(cancel-matching)",
        error.message
      );
    }
  });
};

const handleClientPreparing = (io, socket, data) => {
  const { mode, resource, room, client } = data;
  const roomService = roomBuilder(mode, resource);

  const preparedRoom = roomService.prepareRoom(room._id, client);

  const { _id } = preparedRoom;

  if (roomService.isReadyToPlaying(_id)) {
    const roomWithNewState = roomService.updateRoom(_id, {
      state: ROOM.STATE.loading_question,
    });

    io.in(_id).emit(
      "conquer:server-client(start-loading-question)",
      roomWithNewState
    );
    return;
  }

  io.in(_id).emit("conquer:server-client(preparing)", preparedRoom, client);
};
const onClientPreparing = (io, socket) => {
  socket.on("conquer:client-server(preparing)", (data) => {
    try {
      handleClientPreparing(io, socket, data);
    } catch (error) {
      socket.emit("[ERROR]conquer:server-client(preparing)", error.message);
    }
  });
};

const handleTimeoutPreparing = (io, socket, data) => {
  const { mode, resource, room } = data;
  const roomService = roomBuilder(mode, resource);

  const resetRoom = roomService.prepareTimeout(room._id);

  resetGamePlay(io, socket, mode, resource, room, resetRoom);
};
const onTimeoutPreparing = (io, socket) => {
  socket.on("conquer:client-server(timeout-preparing)", (data) => {
    try {
      handleTimeoutPreparing(io, socket, data);
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

  onRefreshForming(io, socket);

  onClientForming(io, socket);

  onClientLeaveForming(io, socket);

  onClientTransferOwnerForming(io, socket);

  onClientRemoveClientForming(io, socket);

  onClientStartForming(io, socket);

  onClientMatching(io, socket);

  onClientCancelMatching(io, socket);

  onClientPreparing(io, socket);

  onTimeoutPreparing(io, socket);

  quickMatchHandler(io, socket, { resetGamePlay });
};
