const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { ImageOptimizer } = require("../middleware/imageOptimization");

const optimizer = new ImageOptimizer({
  quality: 85,
  convertToWebP: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    cb(null, `${uniqueSuffix}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// دالة لحذف الصورة القديمة
function deleteOldImage(oldImagePath) {
  if (!oldImagePath) return;

  try {
    // استخراج اسم الملف من المسار
    const filename = oldImagePath.replace("/uploads/", "");
    const fullPath = path.join(__dirname, "..", "uploads", filename);

    // التحقق من وجود الملف
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("✅ تم حذف الصورة القديمة:", filename);

      // حذف النسخ المحسنة إن وجدت
      const baseName = filename.replace(/\.[^/.]+$/, ""); // اسم الملف بدون الامتداد
      const uploadsDir = path.join(__dirname, "..", "uploads");

      // البحث عن النسخ المحسنة وحذفها
      const patterns = ["-sm", "-md", "-lg", "-xl", "-placeholder"];
      const formats = [".jpg", ".webp", ".avif"];

      patterns.forEach((pattern) => {
        formats.forEach((format) => {
          const optimizedPath = path.join(
            uploadsDir,
            `${baseName}${pattern}${format}`
          );
          if (fs.existsSync(optimizedPath)) {
            fs.unlinkSync(optimizedPath);
            console.log(
              "  ✅ تم حذف النسخة المحسنة:",
              `${baseName}${pattern}${format}`
            );
          }
        });
      });
    }
  } catch (error) {
    console.error("❌ خطأ في حذف الصورة القديمة:", error);
  }
}

// Route رفع مع حذف القديمة
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // حذف الصورة القديمة إذا تم إرسالها
  const oldImageUrl = req.body.oldImageUrl || req.query.oldImageUrl;
  if (oldImageUrl) {
    deleteOldImage(oldImageUrl);
  }

  // إرجاع الصورة الأصلية فوراً
  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: imagePath });

  // تحسين في الخلفية
  setTimeout(async () => {
    try {
      const outputDir = path.join(__dirname, "..", "uploads");
      await optimizer.optimizeImage(req.file.path, outputDir);
      console.log("✅ Image optimized in background:", req.file.filename);
    } catch (error) {
      console.error("❌ Background optimization failed:", error);
    }
  }, 100);
});

// Route لحذف صورة فقط
router.delete("/delete", (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "No image URL provided" });
  }

  deleteOldImage(imageUrl);
  res.json({ message: "Image deleted successfully" });
});

module.exports = router;
