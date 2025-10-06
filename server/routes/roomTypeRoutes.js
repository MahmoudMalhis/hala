const express = require("express");
const router = express.Router();
const {
  createRoomType,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType,
} = require("../controllers/roomTypeController");
const {
  clearCacheMiddleware,
  cacheMiddleware,
} = require("../middleware/cache");

router.post("/", clearCacheMiddleware(["/api/room-types"]), createRoomType);
router.get("/", cacheMiddleware(900), getAllRoomTypes);
router.get("/:id", cacheMiddleware(900), getRoomTypeById);
router.put("/:id", clearCacheMiddleware(["/api/room-types"]), updateRoomType);
router.delete(
  "/:id",
  clearCacheMiddleware(["/api/room-types"]),
  deleteRoomType
);

module.exports = router;
