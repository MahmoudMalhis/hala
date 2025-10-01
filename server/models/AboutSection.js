const mongoose = require("mongoose");

const aboutSectionSchema = new mongoose.Schema(
  {
    title_en: String,
    title_ar: String,
    description_en: String,
    description_ar: String,
    imageURL: { type: String, default: "" },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutSection", aboutSectionSchema);
