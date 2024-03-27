const { Schema, model, Types } = require("mongoose");

const { ObjectId } = Types;

const QuickMatch = new Schema({
  room: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  min_to_start: { type: Number },
  max_capacity: { type: Number },
  owner: { type: ObjectId, ref: "Account", required: true },
  password: { type: String },
  question: { type: ObjectId, ref: "Question", required: true },
  first_raised_hand: { type: ObjectId, ref: "Account", default: null },
});

const Base = model("Quick-Match", QuickMatch);

module.exports = {
  QuickMatch: Base,
};
