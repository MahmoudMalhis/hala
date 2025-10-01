const mongoose = require("mongoose");

const contactSettingsSchema = new mongoose.Schema(
  {
    backgroundImage: [{ type: String }],
    address: [
      {
        ar: { type: String },
        en: { type: String },
      },
    ],
    instagram: { type: String },
    facebook: { type: String },
    whatsapp: { type: String },
    otherLinks: [
      {
        platform: {
          ar: String,
          en: String,
        },
        url: String,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

const ContactSettings = mongoose.model(
  "ContactSettings",
  contactSettingsSchema
);

module.exports = ContactSettings;
