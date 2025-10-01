const express = require("express");
const router = express.Router();
const {
  getContactSettings,
  updateContactSettings,
} = require("../controllers/contactController");

// Get settings
router.get("/", getContactSettings);

// Update settings
router.put("/", updateContactSettings);

module.exports = router;
