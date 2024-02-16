const { Schema, Types, model } = require("mongoose");

const { ObjectId } = Types;

const ACCOUNT_TYPES = { administrator: "ADMINISTRATOR", student: "STUDENT" };

const Account = new Schema(
  {
    phone_number: { type: String, required: true, unique: true },
    is_phone_verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    roles: { type: [String], default: [] },
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
  new Schema({})
);

const Student = Base.discriminator(ACCOUNT_TYPES.student, new Schema({}));

module.exports = {
  ACCOUNT_TYPES,
  Account: Base,
  Administrator,
  Student,
};
