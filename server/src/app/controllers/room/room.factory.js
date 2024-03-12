const {
  ConcreteAutoRoom,
  ConcreteAutoQuickMatch,
} = require("./auto-room.factory");
const {
  ConcreteNormalRoom,
  ConcreteNormalQuickMatch,
} = require("./normal-room.factory");

class RoomFactory {
  constructor(roomInstance) {
    this.roomInstance = roomInstance;
  }

  getRoomInstance() {
    return this.roomInstance;
  }

  getResourceInstance() {
    return this.roomInstance.getResourceInstance();
  }

  isReadyToPrepare(roomId) {
    return this.roomInstance.isReadyToPrepare(roomId);
  }

  isReadyToLoadingQuestion(roomId) {
    return this.roomInstance.isReadyToLoadingQuestion(roomId);
  }

  canLoadingQuestion(roomId) {
    return this.roomInstance.canLoadingQuestion(roomId);
  }

  findRooms(queries) {
    return this.roomInstance.findRooms(queries);
  }

  joinRoom(roomInf, clientInf) {
    return this.roomInstance.joinRoom(roomInf, clientInf);
  }

  leaveRoom(roomId, clientId) {
    return this.roomInstance.leaveRoom(roomId, clientId);
  }

  prepareRoom(roomId, clientInf) {
    return this.roomInstance.prepareRoom(roomId, clientInf);
  }

  updateRoom(roomId, roomInf) {
    return this.roomInstance.updateRoom(roomId, roomInf);
  }

  transferRoomOwner(roomId, newOwnerId) {
    return this.roomInstance.transferRoomOwner(roomId, newOwnerId);
  }

  disconnecting(roomId, socketId) {
    return this.roomInstance.disconnecting(roomId, socketId);
  }

  prepareTimeout(roomId) {
    return this.roomInstance.prepareTimeout(roomId);
  }

  endPlay(roomId) {
    return this.roomInstance.endPlay(roomId);
  }
}

const FACTORIES = {
  "NORMAL-DAU_NHANH": new RoomFactory(
    new ConcreteNormalRoom(new ConcreteNormalQuickMatch())
  ),
  "AUTO-DAU_NHANH": new RoomFactory(
    new ConcreteAutoRoom(new ConcreteAutoQuickMatch())
  ),
};

const roomBuilder = (mode, resource) => {
  const factory = `${mode}-${resource}`;

  if (!FACTORIES[factory]) {
    throw Error(`Factory ${factory} not found!`);
  }

  return FACTORIES[factory];
};

module.exports = {
  roomBuilder,
};
