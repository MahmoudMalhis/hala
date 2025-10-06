const express = require("express");
const router = express.Router();
const {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
  createImagesBatch,
  getBatchesByDesignType,
} = require("../controllers/galleryController");
const {
  cacheMiddleware,
  clearCacheMiddleware,
} = require("../middleware/cache");

router.post("/", clearCacheMiddleware(["/api/gallery"]), createImage);
router.post(
  "/batch",
  clearCacheMiddleware(["/api/gallery"]),
  createImagesBatch
);
router.get("/batches", cacheMiddleware(600), getBatchesByDesignType);
router.get("/", cacheMiddleware(600), getAllImages);
router.get("/:id", cacheMiddleware(600), getImageById);
router.put("/:id", clearCacheMiddleware(["/api/gallery"]), updateImage);
router.delete("/:id", clearCacheMiddleware(["/api/gallery"]), deleteImage);

module.exports = router;
