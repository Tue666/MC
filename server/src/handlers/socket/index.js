/*
	Event format: [special-cases]handler:from-to(key)
	- [special-cases]	: Optional, for special cases such [TESTING], [ERROR], ...
	- handler			: What the socket is processing
	- from				: Where [key] is sent
	- to 				: Where [key] is received
	- key	    		: What definition of information is being sent
*/

const conquerHandler = require("./conquer");

module.exports = (io) => (socket) => {
  conquerHandler(io, socket);
};
