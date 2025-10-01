const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  console.log("Request received for /api/upload");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: imagePath });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during file upload" });
  }
});

module.exports = router;
