// server/middleware/imageOptimization.js
// ⚠️ هذا ملف Node.js - لا يحتوي على أي React/HTML

const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

class ImageOptimizer {
  constructor(options = {}) {
    this.options = {
      // أحجام مختلفة للصور
      sizes: options.sizes || [
        { width: 640, suffix: "md" },
        { width: 1024, suffix: "lg" },
      ],
      // جودة الضغط
      quality: options.quality || 85,
      // تحويل إلى WebP
      convertToWebP: options.convertToWebP !== false,
      // تحويل إلى AVIF (يحتاج Node 16+)
      convertToAVIF: options.convertToAVIF || false,
    };
  }

  /**
   * تحسين صورة واحدة
   */
  async optimizeImage(inputPath, outputDir) {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const results = [];

    try {
      // قراءة الصورة الأصلية
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // إنشاء نسخ بأحجام مختلفة
      for (const size of this.options.sizes) {
        // تخطي إذا كانت الصورة أصغر من الحجم المطلوب
        if (metadata.width <= size.width) continue;

        // JPEG/PNG نسخة محسّنة
        const jpegPath = path.join(outputDir, `${filename}-${size.suffix}.jpg`);
        await image
          .clone()
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: "inside",
          })
          .jpeg({
            quality: this.options.quality,
            progressive: true,
            mozjpeg: true,
          })
          .toFile(jpegPath);

        results.push({
          format: "jpeg",
          width: size.width,
          path: jpegPath,
          size: (await fs.stat(jpegPath)).size,
        });

        // WebP نسخة
        if (this.options.convertToWebP) {
          const webpPath = path.join(
            outputDir,
            `${filename}-${size.suffix}.webp`
          );
          await image
            .clone()
            .resize(size.width, null, {
              withoutEnlargement: true,
              fit: "inside",
            })
            .webp({
              quality: this.options.quality,
              effort: 6,
            })
            .toFile(webpPath);

          results.push({
            format: "webp",
            width: size.width,
            path: webpPath,
            size: (await fs.stat(webpPath)).size,
          });
        }

        // AVIF نسخة (اختياري)
        if (this.options.convertToAVIF) {
          try {
            const avifPath = path.join(
              outputDir,
              `${filename}-${size.suffix}.avif`
            );
            await image
              .clone()
              .resize(size.width, null, {
                withoutEnlargement: true,
                fit: "inside",
              })
              .avif({
                quality: this.options.quality - 5,
                effort: 9,
              })
              .toFile(avifPath);

            results.push({
              format: "avif",
              width: size.width,
              path: avifPath,
              size: (await fs.stat(avifPath)).size,
            });
          } catch (avifError) {
            console.warn("AVIF encoding not supported:", avifError.message);
          }
        }
      }

      // إنشاء placeholder صغير جداً للـ blur effect
      const placeholderPath = path.join(
        outputDir,
        `${filename}-placeholder.jpg`
      );
      await image
        .clone()
        .resize(20) // صغير جداً
        .blur(5)
        .jpeg({ quality: 20 })
        .toFile(placeholderPath);

      // إحصائيات التحسين
      const originalSize = (await fs.stat(inputPath)).size;
      const totalOptimizedSize = results.reduce((sum, r) => sum + r.size, 0);
      const savings =
        originalSize > 0
          ? (
              ((originalSize - totalOptimizedSize) / originalSize) *
              100
            ).toFixed(2)
          : 0;

      return {
        original: {
          path: inputPath,
          size: originalSize,
          width: metadata.width,
          height: metadata.height,
        },
        optimized: results,
        placeholder: placeholderPath,
        savings: `${savings}%`,
      };
    } catch (error) {
      console.error("Error optimizing image:", error);
      throw error;
    }
  }

  /**
   * Express Middleware
   */
  middleware() {
    return async (req, res, next) => {
      // فقط للصور
      if (!req.file || !req.file.mimetype.startsWith("image/")) {
        return next();
      }

      try {
        const outputDir = path.dirname(req.file.path);
        const result = await this.optimizeImage(req.file.path, outputDir);

        // إضافة معلومات التحسين للـ request
        req.optimizedImages = result;

        // حذف الصورة الأصلية (اختياري)
        // await fs.unlink(req.file.path);

        next();
      } catch (error) {
        console.error("Optimization error:", error);
        // في حالة الخطأ، استمر بدون تحسين
        next();
      }
    };
  }
}

module.exports = { ImageOptimizer };
