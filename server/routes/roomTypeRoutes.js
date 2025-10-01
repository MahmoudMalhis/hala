const express = require("express");
const router = express.Router();
const {
  createRoomType,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType,
} = require("../controllers/roomTypeController");

// Create new room type
router.post("/", createRoomType);

// Get all room types
router.get("/", getAllRoomTypes);

// Get single room type by ID
router.get("/:id", getRoomTypeById);

// Update room type
router.put("/:id", updateRoomType);

// Delete room type
router.delete("/:id", deleteRoomType);

module.exports = router;
