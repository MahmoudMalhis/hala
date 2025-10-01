const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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

// Immediately invoked function to initialise the application. We wrap the
// asynchronous setup in an async IIFE so that top‑level await is not
// required. The database is connected before any routes are registered.
(async () => {
  // Connect to SQLite and create tables
  await connectDB();

  // Init app
  const app = express();

  app.use(cors());

  app.use(express.json());

  // room types
  app.use("/api/room-types", roomTypeRoutes);

  // gallery
  app.use("/api/gallery", galleryRoutes);

  // about
  app.use("/api/about-sections", aboutSectionRoutes);

  // home
  app.use("/api/home-settings", homeSettingsRoutes);

  // contact
  app.use("/api/contact", contactRoutes);

  // uploads
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.use("/api/upload", uploadRoute);

  // design-types
  app.use("/api/design-types", designTypeRoutes);

  // authentication
  app.use("/api/auth", authRoutes);

  app.get("/", (req, res) => {
    res.send("Hala Design API is running...");
  });

  // Server listen
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "192.168.1.11", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();
