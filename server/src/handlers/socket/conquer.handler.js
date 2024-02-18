/*
	Event format: handler:from-to(key)
	- handler	: What the socket is processing
	- from		: Where [key] is sent
	- to 		: Where [key] is received
	- key	    : What definition of information is being sent
*/

const roomName = "room-1";
const room = {};

module.exports = (io, socket) => {
  socket.on("conquer:client-server(participate)", (data) => {
    const { clientId, resourceId, limit } = data;
    socket.join(roomName);

    if (!room[resourceId]) room[resourceId] = [clientId];
    else room[resourceId].push(clientId);

    if (room[resourceId].length >= limit) {
      io.in(roomName).emit("conquer:server-client(start-participate)");
      return;
    }

    io.in(roomName).emit(
      "conquer:server-client(participate)",
      room[resourceId].length
    );
  });

  socket.on("conquer:client-server(cancel-participate)", (data) => {
    const { clientId, resourceId } = data;
    room[resourceId] = room[resourceId].filter((client) => client !== clientId);
    io.in(roomName).emit(
      "conquer:server-client(participate)",
      room[resourceId].length
    );
  });
};
