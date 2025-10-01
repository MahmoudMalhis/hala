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

router.post("/", createImage);
router.post("/batch", createImagesBatch);
router.get("/batches", getBatchesByDesignType);
router.get("/", getAllImages);
router.get("/:id", getImageById);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

module.exports = router;
