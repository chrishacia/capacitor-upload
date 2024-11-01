const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const FILE_SIZE_MULTIPLIER = 50;

// Define allowed origins (including mobile)
const allowedOrigins = [
  "https://xxqx.net", // Web domain
  "capacitor://localhost", // iOS mobile app
  "http://localhost", // Android mobile app
  null, // Handle requests with no origin (common for mobile)
];

// Configure CORS to allow requests from allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Configure Multer storage options and set file size limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    // Save the file with the original name and a timestamp to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set individual file size limit (in bytes) and total request size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_MULTIPLIER * 1024 * 1024, // Set individual file size limit to 5MB
  },
});

// Set overall request size limit for Express
app.use(express.json({ limit: `${FILE_SIZE_MULTIPLIER}mb` })); // JSON payload limit if needed
app.use(express.urlencoded({ limit: `${FILE_SIZE_MULTIPLIER}mb`, extended: true })); // URL-encoded payload limit

// API route for handling file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded." });
  }

  // Send back the file path to the client (for thumbnails or further processing)
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ filePath });
});

// Endpoint to return list of uploaded image URLs
app.get("/api/images", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");

  // Read the 'uploads' directory to get file names
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to list images." });
    }

    // Create URLs for each file
    const imageUrls = files.map((file) => `https://xxqx.net/uploads/${file}`);

    // Return the list of image URLs
    res.json(imageUrls);
  });
});

// Serve the uploaded files as static content
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React frontend from client/build
app.use(express.static(path.join(__dirname, "client/build")));

// Route all other requests to React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start the Express server on port 5090
const PORT = process.env.PORT || 5090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
