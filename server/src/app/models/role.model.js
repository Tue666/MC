const { Schema, model } = require("mongoose");
const StringUtil = require("../../utils/string.util");

const ROLE_STATUS = {
  active: "ACTIVE",
  locked: "LOCKED",
};

const Role = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    permissions: {
      type: [
        {
          _id: false,
          resource: { type: String, ref: "Resource", required: true },
          operations: [{ type: String, ref: "Operation", default: [] }],
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(ROLE_STATUS),
      default: ROLE_STATUS.active,
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

Role.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  this._id = StringUtil.toStringID(this.name);
  next();
});

const Base = model("Role", Role);

module.exports = {
  ROLE_STATUS,
  Role: Base,
};
