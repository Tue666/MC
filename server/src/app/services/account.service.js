const { Types } = require("mongoose");
const { ACCOUNT_TYPES } = require("../models/account.model");
const { AccountRepository } = require("../repositories/account.repository");
const { APIError } = require("../../handlers/error.handler");
const BcryptUtil = require("../../utils/bcrypt.util");
const JWTUtil = require("../../utils/jwt.util");
const CloudinaryUtil = require("../../utils/cloundinary.util");
const NumberUtil = require("../../utils/number.util");
const {
  EXPERIENCE_MILESTONE,
  MAX_MATCH_VISIBLE_PER_ACCOUNT,
  POINTS,
} = require("../../config/constant");

const { ObjectId } = Types;

class AccountService {
  async verifyDuplicated(phone_number) {
    const account = await AccountRepository.findOne({
      filters: { phone_number },
      select: { _id: 1 },
    });

    if (account) throw new APIError(200, "Tài khoản đã tồn tại!");
  }

  async verifyPassword(inputPassword, password) {
    const isRightPassword = await BcryptUtil.compare(inputPassword, password);
    if (!isRightPassword) {
      throw new APIError(200, "Thông tin tài khoản không chính xác!");
    }
  }

  buildMatches(matches) {
    if (!matches) return [];

    return matches.map((matches) => ObjectId(matches));
  }

  verifyPasswordConfirm(password, passwordConfirm) {
    if (password !== passwordConfirm) {
      throw new APIError(200, "Mật khẩu không khớp!");
    }
  }

  buildGoldPoint(pointValue, changedValue) {
    const { value } = pointValue;

    const newValue = NumberUtil.calculateChangedValue(value, changedValue);
    pointValue.value = newValue;

    return pointValue;
  }

  buildExperiencePoint(pointValue, changedValue) {
    const newPointValue = NumberUtil.calculateChangedMilestone(
      pointValue,
      changedValue,
      EXPERIENCE_MILESTONE
    );

    return newPointValue;
  }

  buildPoint(point, pointValue, changedValue) {
    const points = {
      gold_point: this.buildGoldPoint,
      experience_point: this.buildExperiencePoint,
    };

    if (!points[point]) return pointValue;

    return {
      ...POINTS[point],
      ...points[point](pointValue, changedValue),
    };
  }

  buildMatch(matches) {
    return {
      matches: {
        $each: this.buildMatches(matches),
        $position: 0,
        $slice: MAX_MATCH_VISIBLE_PER_ACCOUNT,
      },
    };
  }

  async synchronizeResult(body) {
    const { matchId, client } = body;

    const { _id, point_differences } = client;
    const pointDifferences = {};
    const clientIdObj = ObjectId(_id);
    const matchIdObj = ObjectId(matchId);

    const account = await AccountRepository.findOne({
      filters: { _id: clientIdObj },
      select: Object.keys(point_differences).join(" "),
    });
    const accountObj = account.toObject();

    for (const [point, value] of Object.entries(point_differences)) {
      const accountPoint = this.buildPoint(point, accountObj[point], value);

      pointDifferences[point] = {
        changed: value,
        ...accountPoint,
      };
    }

    await AccountRepository.findByIdAndUpdate({
      _id: clientIdObj,
      update: {
        ...pointDifferences,
        $push: this.buildMatch([matchIdObj]),
      },
    });

    client.point_differences = pointDifferences;

    return client;
  }

  async updateWithFile(_id, file) {
    const cloudinaryUploaded = [];

    try {
      const update = {};

      for (let i = 0; i < file.length; i++) {
        const { field, value } = file[i];
        if (!value) {
          throw new APIError(200, "Các giá trị bắt buộc không được bỏ trống!");
        }

        const uploaded = await CloudinaryUtil.upload(value, {
          folder: `cm/account/${field}`,
        });

        update[field] = Array.isArray(value) ? uploaded : uploaded[0];
        cloudinaryUploaded.push(...uploaded);
      }

      const options = {
        new: true,
        runValidators: true,
      };

      const account = await AccountRepository.findByIdAndUpdate({
        _id: ObjectId(_id),
        update,
        options,
      });

      return account;
    } catch (error) {
      await CloudinaryUtil.destroy(cloudinaryUploaded);
      throw new APIError(error.status, error.message);
    }
  }

  async signIn(body) {
    const { phone_number, password } = body;

    const account = await AccountRepository.findOne({
      filters: { phone_number },
      select: { password: 1 },
    });
    if (!account) {
      throw new APIError(200, "Thông tin tài khoản không chính xác!");
    }

    await this.verifyPassword(password, account.password);

    const { _id, account_type } = account;
    const { accessToken } = JWTUtil.generateToken({
      _id,
      account_type,
    });

    return accessToken;
  }

  async signUp(body) {
    const { phone_number, password, passwordConfirm, name } = body;

    await this.verifyDuplicated(phone_number);

    this.verifyPasswordConfirm(password, passwordConfirm);

    const hashedPassword = await BcryptUtil.hash(password);
    const account = await AccountRepository.createStudent({
      phone_number,
      password: hashedPassword,
      name,
    });

    return account;
  }

  async refreshToken(accessToken) {
    const tokenDecoded = JWTUtil.verifyToken(accessToken, {
      ignoreExpiration: true,
    });

    const account = await AccountRepository.findOne({
      filters: { _id: tokenDecoded._id },
      select: { _id: 1, account_type: 1 },
    });
    if (!account) {
      throw new APIError(200, "Thông tin tài khoản không chính xác!");
    }

    const { _id, account_type } = account;
    const { accessToken: refreshedAccessToken } = JWTUtil.generateToken({
      _id,
      account_type,
    });

    return refreshedAccessToken;
  }

  async getProfile(_id) {
    const account = await AccountRepository.findOne({
      filters: { _id: ObjectId(_id) },
      select: { password: 0 },
      populate: {
        path: "matches",
      },
    });
    if (!account) throw new APIError(200, "Không tìm thấy tài khoản!");

    let additionProfile = {};
    switch (account.account_type) {
      case ACCOUNT_TYPES.administrator:
        // Get extra profile of administrator if needed
        break;
      case ACCOUNT_TYPES.student:
        // Get extra profile of student if needed
        break;
      default:
        break;
    }

    return {
      profile: account,
      point: POINTS,
      ...additionProfile,
    };
  }
}

module.exports = {
  AccountService: new AccountService(),
};
