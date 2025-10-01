const express = require("express");
const router = express.Router();
const {
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/aboutSectionController");

router.get("/", getAllSections);
router.post("/", createSection);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

module.exports = router;
