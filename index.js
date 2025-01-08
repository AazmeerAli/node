const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors"); // CORS package ko import karen
const app = express();
const PORT = process.env.PORT || 5000;

// CORS ko allow karen (yahan pe specific origin bhi set kiya jaa sakta hai)
app.use(cors({
  origin: 'http://localhost:5173', // React frontend ka URL
  methods: ['GET', 'POST'], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File not uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Fetch files endpoint
app.get("/files", (req, res) => {
  const fs = require("fs");
  const filesPath = path.join(__dirname, "uploads");

  fs.readdir(filesPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to fetch files" });
    }
    const fileUrls = files.map((file) => `/uploads/${file}`);
    res.status(200).json(fileUrls);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
