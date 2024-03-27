const { ROOM } = require("../../../config/constant");
const ValidateUtil = require("../../../utils/validate.util");
const { NormalRoomService } = require("./normal-room.service");

class AutoRoomService extends NormalRoomService {
  init() {
    this.mode = ROOM.MODE.auto;
    this.resourceInstance.mode = this.mode;
  }

  isRoomAvailable(room) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      room,
      room.state,
      room.minToStart,
      room.clients
    );
    if (!okRequiredFields) return false;

    const { state, minToStart, clients } = room;
    return state === ROOM.STATE.matching && clients.length < minToStart;
  }

  isReadyToPrepare(roomId) {
    const room = this.resourceInstance.findRoomById(roomId);

    return room && room.clients.length >= room.minToStart;
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
      roomInf.state = ROOM.STATE.matching;
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

  prepareTimeout(roomId) {
    this.resourceInstance.deleteRoom(roomId);
  }

  resetPlay(roomId) {
    this.resourceInstance.deleteRoom(roomId);
  }

  handlePreparingDisconnect(disconnectRoom, client) {
    if (this.isAllDisconnect(disconnectRoom)) {
      this.resourceInstance.deleteRoom(disconnectRoom._id);
    }

    return disconnectRoom;
  }

  handleLoadingQuestionDisconnect(disconnectRoom, client) {
    if (this.isAllDisconnect(disconnectRoom)) {
      this.resourceInstance.deleteRoom(disconnectRoom._id);
    }

    return disconnectRoom;
  }

  handleMatchingDisconnect(disconnectRoom, client) {
    return this.resourceInstance.deleteClient(disconnectRoom._id, client._id);
  }

  buildDisconnectHandler(state, disconnectRoom, client) {
    return {
      ...super.buildDisconnectHandler(state, disconnectRoom, client),
      [ROOM.STATE.matching]: this.handleMatchingDisconnect.bind(this),
    };
  }
}

module.exports = {
  AutoRoomService,
};
