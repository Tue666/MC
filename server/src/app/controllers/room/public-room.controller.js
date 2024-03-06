const { ConcreteAutoRoom } = require("./auto-room.controller");

const ROOM_MODE = "PUBLIC";

const ROOM_STATE = {
  preparing: "PREPARING",
  loading_question: "LOADING_QUESTION",
  playing: "PLAYING",
};

class ConcretePublicRoom extends ConcreteAutoRoom {
  joinRoom(client) {
    console.log("Join Public room", client);
  }
}

class ConcretePublicQuickMatch {
  constructor() {
    this.rooms = {
      4: 4,
      5: 5,
      6: 6,
    };
  }

  findRooms() {
    return this.rooms;
  }
}

module.exports = {
  ROOM_MODE,
  ROOM_STATE,
  ConcretePublicRoom,
  ConcretePublicQuickMatch,
};
