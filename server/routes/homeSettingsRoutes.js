const express = require("express");
const router = express.Router();
const {
  getHomeSettings,
  updateHomeSettings,
  createHomeSettings,
} = require("../controllers/homeSettingsController");

router.get("/", getHomeSettings);
router.post("/", createHomeSettings); // ✅ أضف هذا السطر
router.put("/:id", updateHomeSettings); // تعديل الإعدادات

module.exports = router;
