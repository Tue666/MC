const { Schema, model, Types } = require("mongoose");
const { ROOM } = require("../../config/constant");

const { ObjectId } = Types;

const Match = new Schema(
  {
    mode: {
      type: String,
      enum: Object.values(ROOM.MODE),
      required: true,
    },
    resource: { type: String, ref: "Resource", required: true },
    reference_id: { type: ObjectId, required: true },
    state: { type: String },
    start_time: { type: Number, required: true },
    end_time: { type: Number, required: true },
    playing_time: { type: Number, default: null },
    clients: {
      type: [
        {
          _id: { type: ObjectId, ref: "Account", required: true },
          name: { type: String },
          avatar: { type: String },
          state: {
            type: String,
            enum: Object.values(ROOM.CLIENT_STATE),
            default: ROOM.CLIENT_STATE.connect,
          },
          point_differences: {
            type: {
              _id: false,
              gold_point: {
                type: {
                  _id: false,
                  changed: { type: Number, required: true },
                  label: { type: String },
                  icon: { type: String },
                  value: { type: Number, required: true },
                },
              },
              experience_point: {
                type: {
                  _id: false,
                  changed: { type: Number, required: true },
                  label: { type: String },
                  icon: { type: String },
                  value: { type: Number, required: true },
                  maxValue: { type: Number, required: true },
                  level: { type: Number, required: true },
                },
              },
            },
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Base = model("Match", Match);

module.exports = {
  Match: Base,
};
