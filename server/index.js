const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const {
  cacheMiddleware,
  clearCacheMiddleware,
  clearCache,
  getCacheStats,
} = require("./middleware/cache");
const { connectDB } = require("./config/db");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const aboutSectionRoutes = require("./routes/aboutSectionRoutes");
const homeSettingsRoutes = require("./routes/homeSettingsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const path = require("path");
const uploadRoute = require("./routes/uploadRoute");
const designTypeRoutes = require("./routes/designTypeRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

(async () => {
  await connectDB();

  const app = express();

  app.use(
    compression({
      level: 6,
      threshold: 10 * 1024,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }

        return compression.filter(req, res);
      },
    })
  );

  app.use(cors());

  app.use(express.json());

  app.use("/api/gallery", galleryRoutes);
  app.use("/api/room-types", roomTypeRoutes);
  app.use("/api/about-sections", aboutSectionRoutes);
  app.use("/api/home-settings", homeSettingsRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/design-types", designTypeRoutes);

  app.use(
    "/uploads",
    express.static(path.join(__dirname, "/uploads"), {
      maxAge: "30d",
      etag: true,
      lastModified: true,
    })
  );
  app.use("/api/upload", uploadRoute);

  app.use("/api/auth", authRoutes);

  app.get("/", (req, res) => {
    res.send("Hala Design API is running...");
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "192.168.1.11", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();
