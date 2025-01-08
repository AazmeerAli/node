const express = require('express');
const cors = require('cors');  // Import CORS
const multer = require('multer');
const path = require('path');
const ftp = require('basic-ftp');

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors()); // Allows all origins by default

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store file in memory (for FTP upload)
const upload = multer({ storage: storage });

// FTP configuration
const ftpClient = new ftp.Client();
ftpClient.ftp.verbose = true; // Enable FTP logs for debugging

// POST route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    // Connect to FTP server
    await ftpClient.access({
      host: 'ftp://threadnprint.com', // FTP server address (replace with your server's address)
      user: 'u823128830', // FTP username 
      password: 'Legit@threadnprint1.com', // FTP password 
      secure: true, // Use secure FTP
    });

    // Upload file to FTP server
    await ftpClient.uploadFrom(req.file.buffer, `/uploads/${req.file.originalname}`);

    res.send('File uploaded successfully');
  } catch (err) {
    console.error('FTP Upload Error:', err);
    res.status(500).send('Error uploading file to FTP server');
  } finally {
    ftpClient.close(); // Close FTP connection
  }
});

// Server listen
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
