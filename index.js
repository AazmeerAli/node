const express = require('express');
const multer = require('multer');
const ftp = require('basic-ftp');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Set up multer for file handling
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const ftpClient = new ftp.Client();
ftpClient.ftp.verbose = true;

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    console.log("File received:", req.file); // Debugging
    await ftpClient.access({
      host: 'ftp://145.223.77.90',
      user: 'u823128830',
      password: 'Legit@threadnprint1.com',
      secure: true,
    });

    // Upload file to FTP
    await ftpClient.uploadFrom(req.file.buffer, `/uploads/${req.file.originalname}`);
    res.send('File uploaded successfully');
  } catch (err) {
    console.error('FTP Upload Error:', err.message);
    res.status(500).send('Error uploading file to FTP server');
  } finally {
    ftpClient.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
