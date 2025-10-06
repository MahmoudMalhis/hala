const express = require("express");
const router = express.Router();
const {
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/aboutSectionController");
const { cacheMiddleware, clearCacheMiddleware } = require("../middleware/cache");

router.get("/", cacheMiddleware(1800), getAllSections);
router.post("/", clearCacheMiddleware(['/api/about-sections']), createSection);
router.put("/:id", clearCacheMiddleware(['/api/about-sections']), updateSection);
router.delete("/:id", clearCacheMiddleware(['/api/about-sections']), deleteSection);

module.exports = router;
