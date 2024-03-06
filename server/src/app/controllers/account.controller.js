const { isValidObjectId, Types } = require("mongoose");
const { Account, Student, ACCOUNT_TYPES } = require("../models/account.model");
const BcryptUtil = require("../../utils/bcrypt.util");
const CloudinaryUtil = require("../../utils/cloundinary.util");
const JWTUtil = require("../../utils/jwt.util");
const ValidateUtil = require("../../utils/validate.util");

const { ObjectId } = Types;

class AccountController {
  async updateAvatar(req, res, next) {
    const cloudinaryUploaded = [];
    try {
      const avatar = req.file;
      let { _id } = req.account;
      const { avatar_url } = req.body;

      if (!isValidObjectId(_id)) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      _id = ObjectId(_id);

      // Must have avatar to update
      if (!avatar && !avatar_url) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      const transformedData = {};

      // Transform avatar into path
      if (avatar) {
        const { public_id } = await CloudinaryUtil.upload(avatar.path, {
          folder: "account/avatar",
        });
        transformedData["avatar"] = public_id;
        cloudinaryUploaded.push(public_id);
      } else if (avatar_url) {
        transformedData["avatar"] = avatar_url;
      }

      const account = await Account.findByIdAndUpdate(
        _id,
        {
          $set: transformedData,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        msg: `Cập nhật avatar [${_id}] thành công!`,
        account,
      });
    } catch (error) {
      // Remove images were uploaded to cloudinary when insert failed
      if (cloudinaryUploaded.length > 0) {
        await Promise.all(
          cloudinaryUploaded.map(async (image) => {
            await CloudinaryUtil.destroy(image);
          })
        );
      }

      next({ status: 500, msg: error.message });
    }
  }

  async signIn(req, res, next) {
    try {
      const { phone_number, password } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(
        phone_number,
        password
      );
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      const account = await Account.findOne({ phone_number }).select({
        password: 1,
      });
      if (!account) {
        next({ status: 200, msg: "Thông tin tài khoản không chính xác!" });
        return;
      }

      const isRightPassword = await BcryptUtil.compare(
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
      const { phone_number, password, passwordConfirm, name } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(
        phone_number,
        password,
        passwordConfirm
      );
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      const accountExisted = await Account.findOne({ phone_number });
      if (accountExisted) {
        next({ status: 200, msg: "Tài khoản đã tồn tại!" });
        return;
      }

      if (password !== passwordConfirm) {
        next({ status: 200, msg: "Mật khẩu không khớp!" });
        return;
      }

      const hashedPassword = await BcryptUtil.hash(password);
      const account = new Student({
        phone_number,
        password: hashedPassword,
        name,
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

  async getProfile(req, res, next) {
    try {
      let { _id } = req.account;

      if (!isValidObjectId(_id)) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      _id = ObjectId(_id);
      const account = await Account.findOne({ _id }).select({
        password: 0,
      });

      let extraProfile = {};
      const accountType = account.account_type;
      switch (accountType) {
        case ACCOUNT_TYPES.administrator:
          // Get extra profile of administrator if needed
          break;
        case ACCOUNT_TYPES.student:
          // Get extra profile of student if needed
          break;
        default:
          break;
      }

      res.status(200).json({
        profile: account,
        ...extraProfile,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = {
  AccountController: new AccountController(),
};
