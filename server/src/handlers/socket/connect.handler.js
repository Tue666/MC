const conquerConnectHandler = require("./conquer/connect.handler");

const handleConnect = (io, socket) => {
  conquerConnectHandler(io, socket);
};
const onConnect = (io, socket) => {
  try {
    handleConnect(io, socket);
  } catch (error) {
    console.log(`[Error] Connect:`, error.message);
  }
};

module.exports = (io, socket) => {
  onConnect(io, socket);
};
