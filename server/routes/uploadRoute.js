const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { ImageOptimizer } = require("../middleware/imageOptimization");

const router = express.Router();

// ✅ إنشاء instance من ImageOptimizer
const optimizer = new ImageOptimizer({
  sizes: [
    { width: 400, suffix: "sm" }, // للـ thumbnails
    { width: 800, suffix: "md" }, // للعرض العادي
    { width: 1200, suffix: "lg" }, // للشاشات الكبيرة
    { width: 1920, suffix: "xl" }, // للشاشات الضخمة
  ],
  formats: ["webp", "avif"], // صيغ حديثة
  quality: 85,
});

// إعداد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("فقط الصور مسموحة (jpeg, jpg, png, gif, webp)"));
  },
});

// ✅ دالة حذف الصورة القديمة وجميع نسخها المحسّنة
function deleteOldImage(imageUrl) {
  if (!imageUrl) return;

  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "..", "uploads", filename);

    // حذف الصورة الأصلية
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("  ✅ تم حذف الصورة الأصلية:", filename);
    }

    // حذف النسخ المحسّنة
    const baseName = filename.replace(/\.[^.]+$/, "");
    const uploadsDir = path.join(__dirname, "..", "uploads");

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
  } catch (error) {
    console.error("❌ خطأ في حذف الصورة القديمة:", error);
  }
}

// ✅ Route رفع مع التحسين التلقائي
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // حذف الصورة القديمة إذا كانت موجودة
    const oldImageUrl = req.body.oldImageUrl || req.query.oldImageUrl;
    if (oldImageUrl) {
      deleteOldImage(oldImageUrl);
    }

    // ✅ تحسين الصورة مباشرة
    const outputDir = path.join(__dirname, "..", "uploads");
    const optimizationResult = await optimizer.optimizeImage(
      req.file.path,
      outputDir
    );

    console.log("✅ Image optimized successfully:", {
      original: optimizationResult.original.size,
      optimized: optimizationResult.optimized.length,
      savings: optimizationResult.savings,
    });

    // إرجاع مسار الصورة الأصلية (للتوافق مع الكود الحالي)
    const imagePath = `/uploads/${req.file.filename}`;

    // إرجاع معلومات كاملة عن الصور المحسّنة
    res.status(201).json({
      url: imagePath,
      original: imagePath,
      optimized: {
        webp: optimizationResult.optimized
          .filter((img) => img.format === "webp")
          .map((img) => ({
            size: img.width + "w",
            path: `/uploads/${path.basename(img.path)}`,
          })),
        avif: optimizationResult.optimized
          .filter((img) => img.format === "avif")
          .map((img) => ({
            size: img.width + "w",
            path: `/uploads/${path.basename(img.path)}`,
          })),
      },
      placeholder: `/uploads/${path.basename(optimizationResult.placeholder)}`,
      savings: optimizationResult.savings,
    });
  } catch (error) {
    console.error("❌ Image optimization failed:", error);

    // في حالة فشل التحسين، نرجع الصورة الأصلية على الأقل
    const imagePath = `/uploads/${req.file.filename}`;
    res.status(201).json({
      url: imagePath,
      error: "Optimization failed, using original image",
    });
  }
});

// Route لحذف صورة
router.delete("/delete", (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "No image URL provided" });
  }

  deleteOldImage(imageUrl);
  res.json({ message: "Image and all variants deleted successfully" });
});

module.exports = router;
