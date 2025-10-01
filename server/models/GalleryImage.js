const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    title_en: {
      type: String,
      trim: true,
    },
    title_ar: {
      type: String,
      trim: true,
    },
    description_en: {
      type: String,
      trim: true,
    },
    description_ar: {
      type: String,
      trim: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    designType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignType",
      required: true,
    },
    album: {
      type: String,
      trim: true,

    },
  },
  {
    timestamps: true,
  }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);

module.exports = GalleryImage;
