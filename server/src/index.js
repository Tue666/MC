require("dotenv").config();
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const path = require("path");

// config
const db = require("./config/db.config");
// handlers
const socketHandler = require("./handlers/socket");
const errorsHandler = require("./handlers/errors.handle");
// routes
const initialRoutes = require("./routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 5000;

db.connect();
io.on("connection", socketHandler(io));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "../uploads")));

initialRoutes(app);

app.use(errorsHandler);

server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
