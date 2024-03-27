const {
  QuickMatchRepository,
} = require("../../repositories/room/quick-match.repository");
const { NormalRoomService } = require("./normal-room.service");
const { AutoRoomService } = require("./auto-room.service");

class RoomService {
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

  isReadyToPlaying(roomId) {
    return this.roomInstance.isReadyToPlaying(roomId);
  }

  canLoadingQuestion(roomId) {
    return this.roomInstance.canLoadingQuestion(roomId);
  }

  findRooms(query) {
    return this.roomInstance.findRooms(query);
  }

  findRecoveryRoom(clientId) {
    return this.roomInstance.findRecoveryRoom(clientId);
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

  prepareTimeout(roomId) {
    return this.roomInstance.prepareTimeout(roomId);
  }

  resetPlay(roomId) {
    return this.roomInstance.resetPlay(roomId);
  }

  endPlay(room, answered, raisedHandId) {
    return this.roomInstance.endPlay(room, answered, raisedHandId);
  }

  async recovery(clientId) {
    return this.roomInstance.recovery(clientId);
  }

  async connect(room, clientId, clientSocket) {
    return this.roomInstance.connect(room, clientId, clientSocket);
  }

  async disconnecting(roomId, socketId) {
    return this.roomInstance.disconnecting(roomId, socketId);
  }
}

const SERVICES = {
  "NORMAL-DAU_NHANH": new RoomService(
    new NormalRoomService(new QuickMatchRepository())
  ),
  "AUTO-DAU_NHANH": new RoomService(
    new AutoRoomService(new QuickMatchRepository())
  ),
};

const roomBuilder = (mode, resource) => {
  const service = `${mode}-${resource}`;

  if (!SERVICES[service]) {
    throw Error(`Service ${service} not found!`);
  }

  return SERVICES[service];
};

module.exports = {
  SERVICES,
  roomBuilder,
};
