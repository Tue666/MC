const { Schema, Types, model } = require("mongoose");

const { ObjectId } = Types;

const QUESTION_TYPES = {
  single: "SINGLE",
  multiple: "MULTIPLE",
};

const Question = new Schema(
  {
    content: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(QUESTION_TYPES),
      default: QUESTION_TYPES.single,
    },
    resources: { type: [String], ref: "Resource", default: [] },
    description: { type: String, default: "" },
    values: { type: [Number], required: true },
    answer_time: { type: Number, required: true },
    answers: {
      type: [
        {
          value: { type: Number, required: true },
          content: { type: String, required: true },
        },
      ],
      required: true,
    },
    gold_point: { type: Number, default: 0 },
    experience_point: { type: Number, default: 0 },
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
  }
);

const Base = model("Question", Question);

module.exports = {
  QUESTION_TYPES,
  Question: Base,
};
