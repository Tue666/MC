const { ROOM } = require("../../../config/constant");
const TimeUtil = require("../../../utils/time.util");
const ValidateUtil = require("../../../utils/validate.util");
const { MatchService } = require("../match.service");
const { QuickMatchService } = require("../quick-match.service");

class NormalRoomService {
  constructor(resourceInstance) {
    this.resourceInstance = resourceInstance;

    this.init();
    this.recovery();
  }

  init() {
    this.mode = ROOM.MODE.normal;
    this.resourceInstance.mode = this.mode;
  }

  async buildReferenceMapping(recoveryMatches) {
    const referenceMapping = {};
    const references = await this.resourceInstance.findForRecovery(
      recoveryMatches
    );

    for (let i = 0; i < references.length; i++) {
      const reference = references[i];
      referenceMapping[reference._id] = reference;
    }

    return referenceMapping;
  }

  async buildRecoveryRooms(recoveryMatches) {
    const recoveredRooms = {};
    const referenceMapping = await this.buildReferenceMapping(recoveryMatches);

    for (let i = 0; i < recoveryMatches.length; i++) {
      const room = {};
      const match = recoveryMatches[i];
      const reference = referenceMapping[match.reference_id];

      room.matchId = match._id.toString();
      room.referenceId = match.reference_id.toString();
      room.startTime = match.start_time;
      room.endTime = match.end_time;
      room.state = match.state;
      room.createdAt = match.created_at;
      room.clients = match.clients.map((client) => ({
        ...client.toObject(),
        _id: client._id.toString(),
      }));

      recoveredRooms[reference.room] = {
        ...room,
        ...this.resourceInstance.buildRecoveryRoom(reference),
      };
    }

    return recoveredRooms;
  }

  async recovery() {
    // IT WILL TAKE A LITTLE GAP TIME BEFORE RECOVERY
    // EVERY RESTART THE SERVER

    const resource = this.resourceInstance.getResource();
    console.log(`Start recovery: ${this.mode}-${resource}`);

    const recoveryMatches = await MatchService.findForRecovery({
      mode: this.mode,
      resource,
    });
    const recoveredRooms = await this.buildRecoveryRooms(recoveryMatches);

    console.log(
      `Finish recovery: ${this.mode}-${resource}-${
        Object.keys(recoveredRooms).length
      } rooms recovered`
    );

    const mergedRooms = {
      ...this.resourceInstance.getRooms(),
      ...recoveredRooms,
    };

    this.resourceInstance.setRooms(mergedRooms);
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

  isReadyToPlaying(roomId) {
    const room = this.resourceInstance.findRoomById(roomId);

    return room && room.clients.every((client) => client.prepared);
  }

  findRooms(query) {
    return this.resourceInstance.findRooms(query);
  }

  findRecoveryRoom(clientId) {
    return this.resourceInstance.findRecoveryRoom(clientId);
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
      roomInf.state = ROOM.STATE.forming;
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

  transferRoomOwner(roomId, newOwnerId) {
    return this.resourceInstance.transferRoomOwner(roomId, newOwnerId);
  }

  updateRoom(roomId, roomInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(roomId, roomInf);
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    return this.resourceInstance.updateRoom(roomId, roomInf);
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

  resetPlay(roomId) {
    return this.resetRoom(roomId);
  }

  endPlay(room, answered, raisedHandId) {
    return this.resourceInstance.endPlay(room, answered, raisedHandId);
  }

  async roomConnection(roomInf, client, clientSocket) {
    const currentTime = TimeUtil.getCurrentTime();
    // Match ended
    if (currentTime > roomInf.endTime) {
      const answered = [];
      const raisedHandId = roomInf.firstRaisedHand;

      await this.endPlay(roomInf, answered, raisedHandId);
      this.resetPlay(roomInf._id);
      return;
    }

    // Otherwise,
    // Change client state into connect
    const room = this.resourceInstance.updateClient(roomInf._id, {
      socketId: clientSocket,
      _id: client._id,
      state: ROOM.CLIENT_STATE.connect,
    });

    await MatchService.updateClientState({
      _id: room.matchId,
      clientId: client._id,
      state: ROOM.CLIENT_STATE.connect,
    });

    return room;
  }

  async connect(room, clientId, clientSocket) {
    const client = this.resourceInstance.findClientById(room._id, clientId);
    const connection = await this.roomConnection(room, client, clientSocket);

    return connection;
  }

  async roomDisconnection(roomId, client) {
    // Change client state into disconnect
    const room = this.resourceInstance.updateClient(roomId, {
      _id: client._id,
      state: ROOM.CLIENT_STATE.disconnect,
      prepared: false,
    });

    let match = null;
    if (room.matchId) {
      match = await MatchService.updateClientState({
        _id: room.matchId,
        clientId: client._id,
        state: ROOM.CLIENT_STATE.disconnect,
      });
    }

    const originRoom = { ...room };
    let disconnectRoom = room;

    // Transfer owner if the old owner has been disconnect
    if (room.owner === client._id) {
      const connectClients = room.clients.filter(
        (client) => client.state === ROOM.CLIENT_STATE.connect
      );
      if (connectClients.length > 0) {
        disconnectRoom = this.resourceInstance.transferRoomOwner(
          room._id,
          connectClients[0]._id
        );

        if (match) {
          await QuickMatchService.update({
            _id: match.reference_id,
            owner: connectClients[0]._id,
          });
        }
      }
    }

    return { originRoom, disconnectRoom };
  }

  handleFormingDisconnect(disconnectRoom, client) {
    if (this.isAllDisconnect(disconnectRoom)) {
      this.resourceInstance.deleteRoom(disconnectRoom._id);
    }

    return disconnectRoom;
  }

  handlePreparingDisconnect(disconnectRoom, client) {
    if (this.isAllDisconnect(disconnectRoom)) {
      return this.resetRoom(disconnectRoom._id);
    }

    return disconnectRoom;
  }

  handleLoadingQuestionDisconnect(disconnectRoom, client) {
    if (this.isAllDisconnect(disconnectRoom)) {
      return this.resetRoom(disconnectRoom._id);
    }

    return disconnectRoom;
  }

  buildDisconnectHandler() {
    const handlers = {
      [ROOM.STATE.forming]: this.handleFormingDisconnect.bind(this),
      [ROOM.STATE.preparing]: this.handlePreparingDisconnect.bind(this),
      [ROOM.STATE.loading_question]:
        this.handleLoadingQuestionDisconnect.bind(this),
    };

    return handlers;
  }

  async disconnecting(roomId, socketId) {
    const client = this.resourceInstance.findClientBySocketId(roomId, socketId);
    const { originRoom, disconnectRoom } = await this.roomDisconnection(
      roomId,
      client
    );

    const { state } = disconnectRoom;
    const disconnectHandlers = this.buildDisconnectHandler();
    const room = disconnectHandlers[state]
      ? disconnectHandlers[state](disconnectRoom, client)
      : disconnectRoom;

    return { originRoom, room, client };
  }
}

module.exports = {
  NormalRoomService,
};
