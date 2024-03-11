const ROOM = {
  ID_CONNECTOR: "@",
  MODE: {
    auto: "AUTO",
    normal: "NORMAL",
  },
  STATE: {
    forming: "FORMING",
    matching: "MATCHING",
    preparing: "PREPARING",
    loading_question: "LOADING_QUESTION",
    playing: "PLAYING",
  },
  CLIENT_STATE: {
    connect: "CONNECT",
    disconnect: "DISCONNECT",
  },
};

module.exports = { ROOM };
