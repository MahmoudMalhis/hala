const express = require("express");
const router = express.Router();
const {
  getHomeSettings,
  updateHomeSettings,
  createHomeSettings,
} = require("../controllers/homeSettingsController");
const {
  clearCacheMiddleware,
  cacheMiddleware,
} = require("../middleware/cache");

router.get("/", cacheMiddleware(1800), getHomeSettings);
router.post(
  "/",
  clearCacheMiddleware(["/api/home-settings"]),
  createHomeSettings
);
router.put(
  "/:id",
  clearCacheMiddleware(["/api/home-settings"]),
  updateHomeSettings
);

module.exports = router;
