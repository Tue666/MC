const conquerDisconnectingHandler = require("./conquer/conquer-disconnecting.handler");

const onDisconnecting = (io, socket) => {
  socket.on("disconnecting", async () => {
    try {
      await conquerDisconnectingHandler(io, socket);
    } catch (error) {
      console.log(`[Error] Disconnecting:`, error.message);
    }
  });
};

module.exports = (io, socket) => {
  onDisconnecting(io, socket);
};
