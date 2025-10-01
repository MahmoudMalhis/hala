const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: true,
      trim: true,
    },
    name_ar: {
      type: String,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomType = mongoose.model("RoomType", roomTypeSchema);

module.exports = RoomType;
