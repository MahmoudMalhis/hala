// routes/designTypeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllDesignTypes,
  getDesignTypeById,
  createDesignType,
  deleteDesignType,
  updateDesignType,
} = require("../controllers/designTypeController");
const {
  cacheMiddleware,
  clearCacheMiddleware,
} = require("../middleware/cache");

router.get("/", cacheMiddleware(900), getAllDesignTypes);
router.get("/:id", cacheMiddleware(900), getDesignTypeById);
router.post("/", clearCacheMiddleware(["/api/design-types"]), createDesignType);
router.delete(
  "/:id",
  clearCacheMiddleware(["/api/design-types"]),
  deleteDesignType
);
router.put(
  "/:id",
  clearCacheMiddleware(["/api/design-types"]),
  updateDesignType
);

module.exports = router;
