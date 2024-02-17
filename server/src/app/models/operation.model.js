const { Schema, model } = require("mongoose");
const StringUtil = require("../../utils/string.util");

const OPERATION_STATUS = {
  active: "ACTIVE",
  locked: "LOCKED",
};

const Operation = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(OPERATION_STATUS),
      default: OPERATION_STATUS.active,
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

Operation.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  this._id = StringUtil.toStringID(this.name);
  next();
});

const Base = model("Operation", Operation);

module.exports = {
  OPERATION_STATUS,
  Operation: Base,
};
