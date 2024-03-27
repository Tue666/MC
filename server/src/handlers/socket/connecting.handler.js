const conquerConnectHandler = require("./conquer/conquer-connect.handler");

module.exports = (io, socket) => {
  conquerConnectHandler(io, socket);
};
