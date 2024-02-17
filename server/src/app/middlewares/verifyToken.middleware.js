const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const accessToken = authorizationHeader && authorizationHeader.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  try {
    const account = jwt.verify(accessToken, process.env.SECRET_SIGNATURE);
    req.account = account;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json("Thông tin tài khoản không chính xác!");
    }
    res.status(403).json("Thông tin tài khoản không chính xác!");
  }
};

module.exports = verifyToken;
