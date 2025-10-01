const mongoose = require("mongoose");

const homeSettingsSchema = new mongoose.Schema(
  {
    mainTitle_en: { type: String, required: true },
    mainTitle_ar: { type: String, required: true },
    subTitle_en: { type: String, required: true },
    subTitle_ar: { type: String, required: true },
    backgroundImage: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeSettings", homeSettingsSchema);
