/*
	Event format: [special-cases]handler:from-to(key)
	- [special-cases]		: Optional, for special cases such [TESTING], [ERROR], ...
	- handler			    : What the socket is processing
	- from				    : Where [key] is sent
	- to 				   	: Where [key] is received
	- key	    		    : Definition of what information is being sent
*/

const connectingHandler = require("./connecting.handler");
const disconnectingHandler = require("./disconnecting.handler");
const conquerHandler = require("./conquer");

module.exports = (io) => (socket) => {
  connectingHandler(io, socket);

  disconnectingHandler(io, socket);

  conquerHandler(io, socket);
};
