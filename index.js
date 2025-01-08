const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Folder to store files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // File name with timestamp
  },
});

const upload = multer({ storage: storage });

// POST route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send({ filename: req.file.filename });
});

// Server listen
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
