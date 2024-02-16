require("dotenv").config();
const express = require("express");
const path = require("path");

// config
const db = require("./config/db.config");
// handlers
const errorsHandler = require("./handlers/errors.handle");
// routes
const initialRoutes = require("./routes");

const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 5000;

db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "../uploads")));

initialRoutes(app);

app.use(errorsHandler);

server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
