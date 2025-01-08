// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// Enable CORS for the frontend origin (http://localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Multer storage setup to save files in 'uploads' folder inside 'public_html'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public_html', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // To avoid file name conflicts
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send({ message: 'File uploaded successfully!', filePath: `/uploads/${req.file.filename}` });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
