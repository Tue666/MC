const { Schema, model } = require("mongoose");
const StringUtil = require("../../utils/string.util");

const RESOURCE_STATUS = {
  active: "ACTIVE",
  locked: "LOCKED",
};

const Resource = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    priority: { type: Number, default: 0 },
    difficulty: { type: Number, default: 0 },
    operations: { type: [String], ref: "Operation", default: [] },
    status: {
      type: String,
      enum: Object.values(RESOURCE_STATUS),
      default: RESOURCE_STATUS.active,
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

Resource.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  this._id = StringUtil.toStringID(this.name);
  next();
});

const Base = model("Resource", Resource);

module.exports = {
  RESOURCE_STATUS,
  Resource: Base,
};
