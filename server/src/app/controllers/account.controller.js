const { Account, Student } = require("../models/account.model");
const BcryptUtils = require("../../utils/bcrypt.util");
const JWTUtil = require("../../utils/jwt.util");

class AccountController {
  async signIn(req, res, next) {
    try {
      const { phone_number, password } = req.body;

      const account = await Account.findOne({ phone_number }).select({
        password: 1,
      });
      if (!account) {
        next({ status: 200, msg: "Thông tin tài khoản không chính xác!" });
        return;
      }

      const isRightPassword = await BcryptUtils.compare(
        password,
        account.password
      );
      if (!isRightPassword) {
        next({ status: 200, msg: "Thông tin tài khoản không chính xác!" });
        return;
      }

      const { _id, account_type } = account;
      const { accessToken } = JWTUtil.generateToken({
        _id,
        account_type,
      });

      res.status(200).json({
        accessToken,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async signUp(req, res, next) {
    try {
      const { phone_number, password, passwordConfirm } = req.body;

      const accountExisted = await Account.findOne({ phone_number });
      if (accountExisted) {
        next({ status: 200, msg: "Tài khoản đã tồn tại!" });
        return;
      }

      if (password !== passwordConfirm) {
        next({ status: 200, msg: "Mật khẩu không khớp!" });
        return;
      }

      const hashedPassword = await BcryptUtils.hash(password);
      const account = new Student({
        phone_number,
        password: hashedPassword,
      });
      await account.save();

      res.status(201).json({
        msg: "Tạo tài khoản [STUDENT] thành công",
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async refreshToken(req, res, next) {
    const authorizationHeader = req.headers["authorization"];
    const accessToken =
      authorizationHeader && authorizationHeader.split(" ")[1];

    try {
      const tokenDecoded = JWTUtil.verifyToken(accessToken, {
        ignoreExpiration: true,
      });
      const account = await Account.findOne({ _id: tokenDecoded._id });
      if (!account) {
        next({ status: 200, msg: "Thông tin tài khoản không chính xác!" });
        return;
      }

      const { _id, account_type } = account;
      const { accessToken: refreshedAccessToken } = JWTUtil.generateToken({
        _id,
        account_type,
      });

      res.status(200).json({
        accessToken: refreshedAccessToken,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async verifyToken(req, res, next) {
    try {
      res.status(200).json(true);
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new AccountController();
