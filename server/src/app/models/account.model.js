const { Schema, Types, model } = require("mongoose");
const { EXPERIENCE_MILESTONE } = require("../../config/constant");
const StringUtil = require("../../utils/string.util");

const { ObjectId } = Types;

const DEFAULT_ADMINISTRATOR_ROLE = "ADMINISTRATOR";
const DEFAULT_STUDENT_ROLE = "STUDENT";
const ACCOUNT_TYPES = { administrator: "ADMINISTRATOR", student: "STUDENT" };

const Account = new Schema(
  {
    phone_number: { type: String, required: true, unique: true },
    is_phone_verified: { type: Boolean, default: false },
    name: { type: String, default: StringUtil.randomGenerate(10) },
    cover: { type: String, default: null },
    avatar: { type: String, default: null },
    password: { type: String, required: true },
    gold_point: {
      type: {
        _id: false,
        value: { type: Number },
      },
      default: {
        value: 0,
      },
    },
    experience_point: {
      type: {
        _id: false,
        value: { type: Number },
        maxValue: { type: Number },
        level: { type: Number },
      },
      default: {
        value: 0,
        maxValue: EXPERIENCE_MILESTONE[1].maxValue,
        level: EXPERIENCE_MILESTONE[1].level,
      },
    },
    matches: { type: [ObjectId], ref: "Match", default: [] },
    deleted_at: { type: Date, default: null },
    deleted_by: {
      type: {
        _id: { type: ObjectId, required: true },
        name: { type: String },
      },
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    discriminatorKey: "account_type",
  }
);

const Base = model("Account", Account);

const Administrator = Base.discriminator(
  ACCOUNT_TYPES.administrator,
  new Schema({
    roles: { type: [String], default: [DEFAULT_ADMINISTRATOR_ROLE] },
  })
);

const Student = Base.discriminator(
  ACCOUNT_TYPES.student,
  new Schema({
    roles: { type: [String], default: [DEFAULT_STUDENT_ROLE] },
  })
);

module.exports = {
  ACCOUNT_TYPES,
  Account: Base,
  Administrator,
  Student,
};
