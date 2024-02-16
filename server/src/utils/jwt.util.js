const jwt = require("jsonwebtoken");
const { secret } = require("../config");

// const SIGNATURE_EXPIRE_TIME = 60 * 60; // 1 hour
const SIGNATURE_EXPIRE_TIME = 60 * 5; // Test

class JWTUtil {
  static verifyToken(token, options = {}) {
    return jwt.verify(token, secret.signature, options);
  }

  static generateToken(payload) {
    const accessToken = jwt.sign(payload, secret.signature, {
      expiresIn: SIGNATURE_EXPIRE_TIME,
    });

    return { accessToken };
  }
}

module.exports = JWTUtil;
