const { ROOM } = require("../../../config/constant");
const ValidateUtil = require("../../../utils/validate.util");

class ConcreteAutoRoom {
  constructor(resourceInstance) {
    this.resourceInstance = resourceInstance;
  }

  getResourceInstance() {
    return this.resourceInstance;
  }

  findBySocket(roomId, socketId) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      roomId,
      socketId
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const room = this.resourceInstance.findRoomById(roomId);
    if (!room) return;

    const clientSocket = this.resourceInstance.findClientBySocketId(
      room._id,
      socketId
    );

    return { room, client: clientSocket };
  }

  findRooms() {
    return this.resourceInstance.findRooms();
  }

  joinRoom(roomInf, clientInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      roomInf,
      clientInf
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const rooms = this.resourceInstance.findRooms();

    let availableRoom = null;

    for (const _id in rooms) {
      const room = rooms[_id];
      if (!this.resourceInstance.isRoomAvailable(room)) continue;

      availableRoom = _id;
      break;
    }

    if (!availableRoom) {
      const createdRoom = this.resourceInstance.createRoom(roomInf);
      availableRoom = createdRoom._id;
    }

    const joinedRoom = this.resourceInstance.createClient(
      availableRoom,
      clientInf
    );

    return joinedRoom;
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

    return leftRoom;
  }

  prepareRoom(roomId, clientInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      roomId,
      clientInf
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    let preparedRoom = this.resourceInstance.updateClient(roomId, clientInf);

    if (!preparedRoom.owner) {
      preparedRoom = this.resourceInstance.updateRoom(roomId, {
        owner: clientInf._id,
      });
    }

    return preparedRoom;
  }

  updateRoom(roomId, roomInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(roomId, roomInf);
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    return this.resourceInstance.updateRoom(roomId, roomInf);
  }

  deleteRoom(roomId) {
    return this.resourceInstance.deleteRoom(roomId);
  }

  updateClient(roomId, clientInf) {
    return this.resourceInstance.updateClient(roomId, clientInf);
  }
}

class ConcreteAutoQuickMatch {
  constructor() {
    // Rooms example
    // this.rooms = {
    //   AUTO@DAU_NHANH@666: {
    //     _id: "AUTO@DAU_NHANH@666",
    //     state: "MATCHING",
    //     owner: '1',
    //     password: null,
    //     maxCapacity: 10,
    //     firstRaisedHand: '1',
    //     createdAt: '2024-03-03T02:32:08.973Z',
    //     clients: [
    //       { socketId: '1', _id: '1', name: "Client 1", state: "CONNECT", prepared: false },
    //       { socketId: '2', _id: '2', name: "Client 2", state: "CONNECT", prepared: false },
    //     ],
    //   },
    // };

    this.resource = "DAU_NHANH";
    this.rooms = {};
  }

  isRoomAvailable(room) {
    const { state, maxCapacity, clients } = room;
    return state === ROOM.STATE.matching || clients.length < maxCapacity;
  }

  findRooms() {
    return this.rooms;
  }

  findRoomById(roomId) {
    return this.rooms[roomId];
  }

  createRoom(roomInf) {
    const roomId = `${ROOM.MODE.auto}${ROOM.ID_CONNECTOR}${this.resource}${
      ROOM.ID_CONNECTOR
    }${new Date().getTime()}`;

    this.rooms[roomId] = {
      _id: roomId,
      ...this.buildDefaultRoom(),
      ...roomInf,
    };

    return this.rooms[roomId];
  }

  buildDefaultRoom() {
    return {
      state: ROOM.STATE.matching,
      owner: null,
      firstRaisedHand: null,
      createdAt: new Date().toISOString(),
      clients: [],
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

    const hasClient = this.rooms[roomId].clients.find(
      (client) => client._id === clientInf._id
    );
    if (!hasClient) {
      this.rooms[roomId].clients.push({
        ...this.buildDefaultClient(),
        ...clientInf,
      });
    }

    return this.rooms[roomId];
  }

  buildDefaultClient() {
    return {
      state: ROOM.CLIENT_STATE.connect,
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
  ConcreteAutoRoom,
  ConcreteAutoQuickMatch,
};
