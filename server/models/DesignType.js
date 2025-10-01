// models/DesignType.js
const mongoose = require("mongoose");

const designTypeSchema = new mongoose.Schema(
  {
    name_en: { type: String, required: true, trim: true },
    name_ar: { type: String, required: true, trim: true },
    imageURL: { type: String, required: true }, // حقل الصورة
  },
  { timestamps: true }
);

module.exports = mongoose.model("DesignType", designTypeSchema);
