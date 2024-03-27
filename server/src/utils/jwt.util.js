const jwt = require("jsonwebtoken");
const { serverConfig } = require("../config");

// const SIGNATURE_EXPIRE_TIME = 60 * 60; // 1 hour
const SIGNATURE_EXPIRE_TIME = 60 * 5; // Test

class JWTUtil {
  static verifyToken(token, options = {}) {
    return jwt.verify(token, serverConfig.signature, options);
  }

  static generateToken(payload) {
    const accessToken = jwt.sign(payload, serverConfig.signature, {
      expiresIn: SIGNATURE_EXPIRE_TIME,
    });

    return { accessToken };
  }
}

module.exports = JWTUtil;
