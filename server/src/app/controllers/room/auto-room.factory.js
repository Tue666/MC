const {
  ConcreteNormalQuickMatch,
  ConcreteNormalRoom,
} = require("./normal-room.factory");
const ValidateUtil = require("../../../utils/validate.util");
const { ROOM } = require("../../../config/constant");

class ConcreteAutoRoom extends ConcreteNormalRoom {
  constructor(resourceInstance) {
    super(resourceInstance);
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
    return state === ROOM.STATE.matching && clients.length < maxCapacity;
  }

  isReadyToPrepare(roomId) {
    const room = this.resourceInstance.findRoomById(roomId);

    return room && room.clients.length >= room.maxCapacity;
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

    // Loop over auto matching rooms and join if any available
    for (const _id in rooms) {
      const room = rooms[_id];
      if (!this.isRoomAvailable(room)) continue;

      availableRoom = _id;
      break;
    }

    // Otherwise, create new matching and join
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
      clientInf,
      clientInf._id
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    let preparedRoom = this.resourceInstance.updateClient(roomId, clientInf);

    // Set the first prepared is room owner
    if (!preparedRoom.owner) {
      preparedRoom = this.resourceInstance.transferRoomOwner(
        preparedRoom._id,
        clientInf._id
      );
    }

    return preparedRoom;
  }

  handlePreparingDisconnect(room, client) {
    if (this.isAllDisconnect(room)) {
      this.resourceInstance.deleteRoom(room._id);
    }

    return room;
  }

  handleLoadingQuestionDisconnect(room, client) {
    if (this.isAllDisconnect(room)) {
      this.resourceInstance.deleteRoom(room._id);
    }

    return room;
  }

  handlePlayingDisconnect(room, client) {
    if (this.isAllDisconnect(room)) {
      this.resourceInstance.deleteRoom(room._id);
    }

    return room;
  }

  handleMatchingDisconnect(room, client) {
    return this.resourceInstance.deleteClient(room._id, client._id);
  }

  buildDisconnectHandler() {
    return {
      ...super.buildDisconnectHandler(),
      [ROOM.STATE.matching]: this.handleMatchingDisconnect.bind(this),
    };
  }

  prepareTimeout(roomId) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(roomId);
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.resourceInstance.deleteRoom(roomId);
  }

  endPlay(roomId) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(roomId);
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.resourceInstance.deleteRoom(roomId);
  }
}

class ConcreteAutoQuickMatch extends ConcreteNormalQuickMatch {
  constructor() {
    // Rooms example
    // this.rooms = {
    //   AUTO@DAU_NHANH@666: {
    //     _id: "AUTO@DAU_NHANH@666",
    //     name: 'Name of room',
    //     description: 'Describes the room',
    //     state: "MATCHING",
    //     owner: '1',
    //     maxCapacity: 10,
    //     question: { _id: '1' },
    //     firstRaisedHand: '1',
    //     createdAt: '2024-03-03T02:32:08.973Z',
    //     clients: [
    //       { socketId: '1', _id: '1', name: "Client 1", state: "CONNECT", prepared: false },
    //       { socketId: '2', _id: '2', name: "Client 2", state: "CONNECT", prepared: false },
    //     ],
    //   },
    // };

    super();
  }

  buildRoomId() {
    return `${ROOM.MODE.auto}${ROOM.ID_CONNECTOR}${this.resource}${
      ROOM.ID_CONNECTOR
    }${new Date().getTime()}`;
  }

  buildDefaultRoom() {
    return {
      state: ROOM.STATE.matching,
      owner: null,
      maxCapacity: this.defaultMaxCapacity,
      question: null,
      firstRaisedHand: null,
      createdAt: new Date().toISOString(),
      clients: [],
    };
  }
}

module.exports = {
  ConcreteAutoRoom,
  ConcreteAutoQuickMatch,
};
