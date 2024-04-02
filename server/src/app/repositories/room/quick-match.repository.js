const { QuestionService } = require("../../services/question.service");
const { MatchService } = require("../../services/match.service");
const { QuickMatchService } = require("../../services/quick-match.service");
const { ConversationService } = require("../../services/conversation.service");
const { ROOM } = require("../../../config/constant");
const TimeUtil = require("../../../utils/time.util");

class QuickMatchRepository {
  constructor() {
    // Rooms example
    // this.rooms = {
    //   NORMAL@DAU_NHANH@666: {
    //     _id: "NORMAL@DAU_NHANH@666",
    //     name: 'Name of room',
    //     description: 'Describes the room',
    //     minToStart: 5,
    //     maxCapacity: 50,
    //     owner: '1',
    //     password: null,
    //     conversationId: null,
    //     matchId: null,
    //     referenceId: null,
    //     startTime: 1,
    //     endTime: 1,
    //     state: "FORMING",
    //     question: { _id: '1', content: 'Question 1', ..., answer_time: 10000 },
    //     firstRaisedHand: '1',
    //     createdAt: '2024-03-03T02:32:08.973Z',
    //     clients: [
    //       { socketId: '1', _id: '1', name: "Client 1", avatar: 'avatar_url', state: "CONNECT", prepared: false },
    //       { socketId: '2', _id: '2', name: "Client 2", avatar: 'avatar_url', state: "CONNECT", prepared: false },
    //     ],
    //   },
    // };

    this.resource = "DAU_NHANH";
    this.rooms = {};
  }

  getResource() {
    return this.resource;
  }

  getRooms() {
    return this.rooms;
  }

  setRooms(rooms) {
    this.rooms = rooms;
  }

  async findForRecovery(recoveryMatches) {
    const quickMatchIds = recoveryMatches.map((match) => match.reference_id);
    const quickMatches = await QuickMatchService.findForRecovery({
      _ids: quickMatchIds,
    });

    return quickMatches;
  }

  buildRecoveryRoom(quickMatch) {
    const room = {};

    room._id = quickMatch.room;
    room.name = quickMatch.name;
    room.description = quickMatch.description;
    room.minToStart = quickMatch.min_to_start;
    room.maxCapacity = quickMatch.max_capacity;
    room.owner = quickMatch.owner?.toString() ?? undefined;
    room.password = quickMatch.password;
    room.question = {
      ...quickMatch.question.toObject(),
      _id: quickMatch.question._id.toString(),
    };
    room.firstRaisedHand =
      quickMatch.first_raised_hand?.toString() ?? undefined;

    return room;
  }

  canRecoveryRoom(room, clientId) {
    const { state, clients } = room;

    return (
      (state === ROOM.STATE.forming || state === ROOM.STATE.playing) &&
      !!clients.find((client) => client._id === clientId)
    );
  }

  canLoadingQuestion(roomId) {
    const room = this.findRoomById(roomId);

    return !room.question;
  }

  findRooms(query) {
    if (!query) return this.rooms;

    const rooms = Object.entries(this.rooms)
      .filter(([key, value]) => query && query(value))
      .reduce((acc, [key, value]) => {
        acc[key] = value;

        return acc;
      }, {});

    return rooms;
  }

  findRoomById(roomId) {
    const room = this.rooms[roomId];
    if (!room) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    return room;
  }

  findRecoveryRoom(clientId) {
    const query = (room) => this.canRecoveryRoom(room, clientId);
    const rooms = this.findRooms(query);
    if (Object.keys(rooms).length <= 0) return;

    return {
      mode: this.mode,
      resource: this.resource,
      room: Object.values(rooms)[0],
    };
  }

  buildRoomId() {
    const currentTime = TimeUtil.getCurrentTime();

    return `${this.mode}${ROOM.ID_CONNECTOR}${this.resource}${ROOM.ID_CONNECTOR}${currentTime}`;
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
      createdAt: new Date().toISOString(),
      clients: [],
    };
  }

  buildResetRoom() {
    return {
      matchId: undefined,
      referenceId: undefined,
      startTime: undefined,
      endTime: undefined,
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

    ConversationService.clearConversation(this.rooms[roomId].conversationId);

    delete this.rooms[roomId];
  }

  transferRoomOwner(roomId, newOwnerId) {
    const roomWithNewOwner = this.updateRoom(roomId, {
      owner: newOwnerId,
    });

    return roomWithNewOwner;
  }

  findClientById(roomId, clientId) {
    const room = this.findRoomById(roomId);

    const client = room.clients.find((client) => client._id === clientId);

    return client;
  }

  findClientBySocketId(roomId, socketId) {
    const room = this.findRoomById(roomId);

    const client = room.clients.find((client) => client.socketId === socketId);

    return client;
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
      this.deleteRoom(roomId);
    }

    return cloneRoom;
  }

  async getReferencePoints(referenceId, answered) {
    const referenceResult = await QuickMatchService.calculatePoints({
      _id: referenceId,
      answered,
    });

    return referenceResult;
  }

  async endPlay(room, answered, raisedHandId) {
    const { points, isWinner } = await this.getReferencePoints(
      room.referenceId,
      answered
    );
    const match = await MatchService.calculateResult({
      _id: room.matchId,
      points,
      raisedHand: [raisedHandId],
      isWinner,
    });

    return match;
  }

  extractQuestions(questions) {
    return questions[0];
  }

  async createMatchReference(room, question) {
    const { _id, minToStart, maxCapacity, ...rest } = room;

    const quickMatch = await QuickMatchService.create({
      ...rest,
      room: _id,
      min_to_start: minToStart,
      max_capacity: maxCapacity,
      question: question._id,
    });

    return quickMatch;
  }

  async createMatch(room, questions) {
    if (questions.length <= 0) return room;

    const question = this.extractQuestions(questions);
    const matchReference = await this.createMatchReference(room, question);
    const startTime = TimeUtil.getCurrentTime();
    const endTime = startTime + question.answer_time;

    const match = await MatchService.create({
      mode: this.mode,
      resource: this.resource,
      reference_id: matchReference._id,
      state: ROOM.STATE.playing,
      start_time: startTime,
      end_time: endTime,
      clients: room.clients,
    });

    const roomWithMatch = this.updateRoom(room._id, {
      matchId: match._id,
      referenceId: match.reference_id,
      startTime: match.start_time,
      endTime: match.end_time,
      state: match.state,
      question,
    });

    return roomWithMatch;
  }

  async findQuestion(queryParams) {
    const randomQuestions = await QuestionService.findByRandom({
      resources: [this.resource],
      ...queryParams,
    });

    return randomQuestions;
  }

  async loadingQuestion(room, queryParams) {
    const questions = await this.findQuestion(queryParams);

    const roomWithMatch = await this.createMatch(room, questions);

    return {
      roomWithMatch,
      questions,
    };
  }

  async raisedHand(roomId, clientId) {
    const room = this.findRoomById(roomId);

    let hasFirstRaised = false;

    if (room.firstRaisedHand) {
      hasFirstRaised = true;
      return hasFirstRaised;
    }

    await QuickMatchService.update({
      _id: room.referenceId,
      first_raised_hand: clientId,
    });

    await this.updateRoom(roomId, {
      firstRaisedHand: clientId,
    });

    return hasFirstRaised;
  }
}

module.exports = {
  QuickMatchRepository,
};
