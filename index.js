const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Multer setup to store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Specify the folder where files should be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // File name will be current timestamp
  }
});

const upload = multer({ storage: storage });

// Post route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
