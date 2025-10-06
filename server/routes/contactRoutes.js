const express = require("express");
const router = express.Router();
const {
  getContactSettings,
  updateContactSettings,
} = require("../controllers/contactController");
const {
  cacheMiddleware,
  clearCacheMiddleware,
} = require("../middleware/cache");

router.get("/", cacheMiddleware(3600), getContactSettings);
router.put("/", clearCacheMiddleware(["/api/contact"]), updateContactSettings);

module.exports = router;
