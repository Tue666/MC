const accountRouter = require("./account.route");
const questionRouter = require("./question.route");
const operationRouter = require("./operation.route");
const resourceRouter = require("./resource.route");
const roleRouter = require("./role.route");
const matchRouter = require("./match.route");
const quickMatchRouter = require("./quick-match.route");

const initialRoutes = (app) => {
  app.use("/api/accounts", accountRouter);
  app.use("/api/questions", questionRouter);
  app.use("/api/operations", operationRouter);
  app.use("/api/resources", resourceRouter);
  app.use("/api/roles", roleRouter);
  app.use("/api/matches", matchRouter);
  app.use("/api/quick-matches", quickMatchRouter);
};

module.exports = initialRoutes;
