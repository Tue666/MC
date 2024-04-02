const conquerDisconnectingHandler = require("./conquer/disconnecting.handler");

const handleDisconnecting = async (io, socket) => {
  await conquerDisconnectingHandler(io, socket);
};
const onDisconnecting = (io, socket) => {
  socket.on("disconnecting", async () => {
    try {
      await handleDisconnecting(io, socket);
    } catch (error) {
      console.log(`[Error] Disconnecting:`, error.message);
    }
  });
};

module.exports = (io, socket) => {
  onDisconnecting(io, socket);
};
