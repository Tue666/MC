const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

class BcryptUtils {
  static async hash(input) {
    return bcrypt.hash(input, SALT_ROUNDS);
  }

  static async compare(input, hashedInput) {
    return bcrypt.compare(input, hashedInput);
  }
}

module.exports = BcryptUtils;
