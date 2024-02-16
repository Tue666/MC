const accountRouter = require("./account.route");

const initialRoutes = (app) => {
  app.use("/api/accounts", accountRouter);
};

module.exports = initialRoutes;
