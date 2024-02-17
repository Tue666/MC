const accountRouter = require("./account.route");
const operationRouter = require("./operation.route");
const resourceRouter = require("./resource.route");
const roleRouter = require("./role.route");

const initialRoutes = (app) => {
  app.use("/api/accounts", accountRouter);
  app.use("/api/operations", operationRouter);
  app.use("/api/resources", resourceRouter);
  app.use("/api/roles", roleRouter);
};

module.exports = initialRoutes;
