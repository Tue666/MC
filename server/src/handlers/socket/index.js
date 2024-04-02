/*
	Event format: [special-cases]handler:from-to(key)
	- [special-cases]		: Optional, for special cases such [TESTING], [ERROR], ...
	- handler			    : What the socket is processing
	- from				    : Where [key] is sent
	- to 				   	: Where [key] is received
	- key	    		    : Definition of what information is being sent
*/

const connectHandler = require("./connect.handler");
const disconnectingHandler = require("./disconnecting.handler");
const conquerHandler = require("./conquer");
const conversationHandler = require("./conversation");

module.exports = (io) => (socket) => {
  connectHandler(io, socket);

  disconnectingHandler(io, socket);

  conversationHandler(io, socket);

  conquerHandler(io, socket);
};
