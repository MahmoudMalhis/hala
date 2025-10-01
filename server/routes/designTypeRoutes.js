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

router.get("/", getAllDesignTypes);
router.get("/:id", getDesignTypeById);
router.post("/", createDesignType);
router.delete("/:id", deleteDesignType);
router.put("/:id", updateDesignType);


module.exports = router;
