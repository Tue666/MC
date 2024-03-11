const { ROOM } = require("../../../config/constant");
const ValidateUtil = require("../../../utils/validate.util");

class ConcreteNormalRoom {
  constructor(resourceInstance) {
    this.resourceInstance = resourceInstance;
  }

  getResourceInstance() {
    return this.resourceInstance;
  }

  isRoomAvailable(room) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      room,
      room.state,
      room.maxCapacity,
      room.clients
    );
    if (!okRequiredFields) return false;

    const { state, maxCapacity, clients } = room;
    return state === ROOM.STATE.forming && clients.length < maxCapacity;
  }

  isRoomAccessible(room, roomInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      room,
      roomInf,
      roomInf.password
    );
    if (!okRequiredFields) return false;

    return room.password === roomInf.password;
  }

  isAllDisconnect(room) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      room,
      room.clients
    );
    if (!okRequiredFields) return false;

    const { clients } = room;
    return clients.every(
      (client) => client.state === ROOM.CLIENT_STATE.disconnect
    );
  }

  isReadyToLoadingQuestion(roomId) {
    const room = this.resourceInstance.findRoomById(roomId);

    return room && room.clients.every((client) => client.prepared);
  }

  canLoadingQuestion(roomId) {
    const room = this.resourceInstance.findRoomById(roomId);

    return room && !room.question;
  }

  findRooms(queries) {
    return this.resourceInstance.findRooms(queries);
  }

  joinRoom(roomInf, clientInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      roomInf,
      clientInf,
      clientInf._id
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    let availableRoom = null;

    if (!roomInf._id) {
      // Client is creating a new room
      roomInf.owner = clientInf._id;
      const createdRoom = this.resourceInstance.createRoom(roomInf);

      availableRoom = createdRoom._id;
    } else {
      // Client is joining a room
      const room = this.resourceInstance.findRoomById(roomInf._id);

      // The room not found
      if (!room) {
        return {
          room: roomInf,
          statusCode: 404,
          error: "Không tìm thấy phòng!",
        };
      }

      // Not meet requirement to join the room
      if (!this.isRoomAvailable(room)) {
        return {
          room: roomInf,
          statusCode: 400,
          error: "Phòng hiện tại không khả dụng!",
        };
      }

      // The room has password and client must provide it
      if (room.password && !roomInf.password) {
        return {
          room: roomInf,
          statusCode: 401,
          error: "Phòng có hạn chế tham gia!",
        };
      }

      // The room has password and client provided a wrong one
      if (room.password && !this.isRoomAccessible(room, roomInf)) {
        return {
          room: roomInf,
          statusCode: 403,
          error: "Mật khẩu không đúng!",
        };
      }

      availableRoom = room._id;
    }

    const joinedRoom = this.resourceInstance.createClient(
      availableRoom,
      clientInf
    );

    return { room: joinedRoom, statusCode: 200, error: null };
  }

  leaveRoom(roomId, clientId) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      roomId,
      clientId
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const leftRoom = this.resourceInstance.deleteClient(roomId, clientId);

    // Return the room if the person who left was not owner or no one remains in room
    if (leftRoom.owner !== clientId || !leftRoom.clients.length) {
      return leftRoom;
    }

    // Otherwise, transfer owner and return the room
    const roomWithNewOwner = this.resourceInstance.transferRoomOwner(
      leftRoom._id,
      leftRoom.clients[0]._id
    );

    return roomWithNewOwner;
  }

  prepareRoom(roomId, clientInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      roomId,
      clientInf,
      clientInf._id
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const preparedRoom = this.resourceInstance.updateClient(roomId, clientInf);

    return preparedRoom;
  }

  updateRoom(roomId, roomInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(roomId, roomInf);
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    return this.resourceInstance.updateRoom(roomId, roomInf);
  }

  handlePreparingDisconnect(room, client) {
    if (this.isAllDisconnect(room)) {
      return this.resetRoom(room._id);
    }

    return room;
  }

  handleLoadingQuestionDisconnect(room, client) {
    if (this.isAllDisconnect(room)) {
      return this.resetRoom(room._id);
    }

    return room;
  }

  handlePlayingDisconnect(room, client) {
    if (this.isAllDisconnect(room)) {
      return this.resetRoom(room._id);
    }

    return room;
  }

  buildDisconnectHandler() {
    return {
      [ROOM.STATE.preparing]: this.handlePreparingDisconnect.bind(this),
      [ROOM.STATE.loading_question]:
        this.handleLoadingQuestionDisconnect.bind(this),
      [ROOM.STATE.playing]: this.handlePlayingDisconnect.bind(this),
    };
  }

  disconnecting(roomId, socketId) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      roomId,
      socketId
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const client = this.resourceInstance.findClientBySocketId(roomId, socketId);

    const room = this.resourceInstance.updateClient(roomId, {
      _id: client._id,
      state: ROOM.CLIENT_STATE.disconnect,
      prepared: false,
    });

    const originRoom = { ...room };
    let roomWithNewOwner = room;

    // Transfer owner if the old owner has been disconnect
    if (room.owner === client._id) {
      const connectClients = room.clients.filter(
        (client) => client.state === ROOM.CLIENT_STATE.connect
      );
      if (connectClients.length > 0) {
        roomWithNewOwner = this.resourceInstance.transferRoomOwner(
          room._id,
          connectClients[0]._id
        );
      }
    }

    const { state } = roomWithNewOwner;
    const disconnectHandler = this.buildDisconnectHandler();

    return {
      originRoom,
      room: disconnectHandler[state]
        ? disconnectHandler[state](roomWithNewOwner, client)
        : roomWithNewOwner,
      client,
    };
  }

  resetRoom(roomId) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(roomId);
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const room = this.resourceInstance.findRoomById(roomId);

    const roomInf = {
      ...room,
      ...this.resourceInstance.buildResetRoom(),
    };

    const resetClients = room.clients.map((client) => ({
      ...client,
      ...this.resourceInstance.buildResetClient(),
    }));

    roomInf.clients = resetClients;

    return this.resourceInstance.updateRoom(roomInf._id, roomInf);
  }

  prepareTimeout(roomId) {
    return this.resetRoom(roomId);
  }

  endPlay(roomId) {
    return this.resetRoom(roomId);
  }
}

class ConcreteNormalQuickMatch {
  constructor() {
    // Rooms example
    // this.rooms = {
    //   NORMAL@DAU_NHANH@666: {
    //     _id: "NORMAL@DAU_NHANH@666",
    //     name: 'Name of room',
    //     description: 'Describes the room',
    //     state: "FORMING",
    //     password: null,
    //     owner: '1',
    //     maxCapacity: 10,
    //     question: { _id: '1' },
    //     firstRaisedHand: '1',
    //     createdAt: '2024-03-03T02:32:08.973Z',
    //     clients: [
    //       { socketId: '1', _id: '1', name: "Client 1", avatar: 'avatar_url', state: "CONNECT", prepared: false },
    //       { socketId: '2', _id: '2', name: "Client 2", avatar: 'avatar_url', state: "CONNECT", prepared: false },
    //     ],
    //   },
    // };

    this.defaultMaxCapacity = 5;
    this.resource = "DAU_NHANH";
    this.rooms = {};
  }

  findRooms(queries = []) {
    return this.rooms;
  }

  findRoomById(roomId) {
    return this.rooms[roomId];
  }

  buildRoomId() {
    return `${ROOM.MODE.normal}${ROOM.ID_CONNECTOR}${this.resource}${
      ROOM.ID_CONNECTOR
    }${new Date().getTime()}`;
  }

  createRoom(roomInf) {
    const roomId = this.buildRoomId();

    this.rooms[roomId] = {
      _id: roomId,
      ...this.buildDefaultRoom(),
      ...roomInf,
    };

    return this.rooms[roomId];
  }

  buildDefaultRoom() {
    return {
      state: ROOM.STATE.forming,
      password: null,
      owner: null,
      maxCapacity: this.defaultMaxCapacity,
      question: null,
      firstRaisedHand: null,
      createdAt: new Date().toISOString(),
      clients: [],
    };
  }

  buildResetRoom() {
    return {
      state: ROOM.STATE.forming,
      question: null,
      firstRaisedHand: null,
    };
  }

  updateRoom(roomId, roomInf) {
    if (!this.rooms[roomId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.rooms[roomId] = {
      ...this.rooms[roomId],
      ...roomInf,
    };

    return this.rooms[roomId];
  }

  deleteRoom(roomId) {
    if (!this.rooms[roomId]) return;

    delete this.rooms[roomId];
  }

  transferRoomOwner(roomId, newOwnerId) {
    if (!this.rooms[roomId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.rooms[roomId].owner = newOwnerId;

    return this.rooms[roomId];
  }

  findClientBySocketId(roomId, socketId) {
    if (!this.rooms[roomId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const clientSocket = this.rooms[roomId].clients.find(
      (client) => client.socketId === socketId
    );

    return clientSocket;
  }

  createClient(roomId, clientInf) {
    if (!this.rooms[roomId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const client = {
      ...this.buildDefaultClient(),
      ...clientInf,
    };

    const clientInRoom = this.rooms[roomId].clients.find(
      (client) => client._id === clientInf._id
    );
    if (clientInRoom) {
      return this.updateClient(roomId, {
        ...clientInRoom,
        ...client,
      });
    }

    this.rooms[roomId].clients.push(client);

    return this.rooms[roomId];
  }

  buildDefaultClient() {
    return {
      state: ROOM.CLIENT_STATE.connect,
      prepared: false,
    };
  }

  buildResetClient() {
    return {
      prepared: false,
    };
  }

  updateClient(roomId, clientInf) {
    if (!this.rooms[roomId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.rooms[roomId].clients = this.rooms[roomId].clients.map((client) =>
      client._id === clientInf._id ? { ...client, ...clientInf } : client
    );

    return this.rooms[roomId];
  }

  deleteClient(roomId, clientId) {
    if (!this.rooms[roomId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.rooms[roomId].clients = this.rooms[roomId].clients.filter(
      (client) => client._id !== clientId
    );

    const cloneRoom = { ...this.rooms[roomId] };

    if (this.rooms[roomId].clients.length <= 0) {
      delete this.rooms[roomId];
    }

    return cloneRoom;
  }

  raisedHand(roomId, clientId) {
    if (!this.rooms[roomId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    let hasFirstRaised = false;

    if (this.rooms[roomId].firstRaisedHand) {
      hasFirstRaised = true;
      return hasFirstRaised;
    }

    this.rooms[roomId].firstRaisedHand = clientId;

    return hasFirstRaised;
  }
}

module.exports = {
  ConcreteNormalRoom,
  ConcreteNormalQuickMatch,
};
