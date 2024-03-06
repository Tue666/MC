const {
  ConcreteAutoRoom,
  ConcreteAutoQuickMatch,
} = require("./auto-room.controller");

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

  findRooms() {
    return this.roomInstance.findRooms();
  }

  findBySocket(roomId, socketId) {
    return this.roomInstance.findBySocket(roomId, socketId);
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

  deleteRoom(roomId) {
    return this.roomInstance.deleteRoom(roomId);
  }

  updateClient(roomId, clientInf) {
    return this.roomInstance.updateClient(roomId, clientInf);
  }
}

const FACTORIES = {
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
