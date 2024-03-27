require("dotenv").config();
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const path = require("path");

// config
const db = require("./config/db.config");
const { serverConfig } = require("./config");
// handlers
const socketHandler = require("./handlers/socket");
const { errorHandler } = require("./handlers/error.handler");
// routes
const initialRoutes = require("./routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  // connectionStateRecovery: {
  //   maxDisconnectionDuration:
  //     serverConfig.connection_state_recovery_duration || 2 * 60 * 1000,
  //   skipMiddlewares: true,
  // },
  pingInterval: serverConfig.ping_interval || 4000,
  pingTimeout: serverConfig.ping_timeout || 4000,
});
const PORT = serverConfig.port || 5000;

db.connect();
io.on("connection", socketHandler(io));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "../uploads")));

initialRoutes(app);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
