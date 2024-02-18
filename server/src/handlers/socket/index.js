const conquerHandler = require("./conquer.handler");

module.exports = (io) => (socket) => {
  conquerHandler(io, socket);
};
