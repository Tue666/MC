const MAX_MATCH_VISIBLE_PER_ACCOUNT = 20;

const CONVERSATION = {
  ID_CONNECTOR: "@",
};

const MESSAGE = {
  ID_CONNECTOR: "@",
};

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
    end: "END",
  },
  CLIENT_STATE: {
    connect: "CONNECT",
    disconnect: "DISCONNECT",
    win: "WIN",
    lose: "LOSE",
  },
};

const POINTS = {
  gold_point: {
    label: "Vàng",
    icon: "app/gold.png",
  },
  experience_point: {
    label: "Kinh nghiệm",
    icon: "app/exp.png",
  },
};

const EXPERIENCE_MILESTONE = {
  1: {
    maxValue: 100,
    level: 1,
  },
  2: {
    maxValue: 200,
    level: 2,
  },
  3: {
    maxValue: 300,
    level: 3,
  },
  4: {
    maxValue: 400,
    level: 4,
  },
  5: {
    maxValue: 500,
    level: 5,
  },
};

module.exports = {
  MAX_MATCH_VISIBLE_PER_ACCOUNT,
  CONVERSATION,
  MESSAGE,
  ROOM,
  POINTS,
  EXPERIENCE_MILESTONE,
};
