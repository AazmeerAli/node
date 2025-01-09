// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const fs = require('fs');
// const { Readable } = require('stream');
// const path = require('path');
// const ftp = require('basic-ftp');

// const app = express();

// // CORS ko enable karna
// app.use(cors());

// // Multer setup for handling file uploads locally first
// const storage = multer.memoryStorage(); // Store the file in memory
// const upload = multer({ storage: storage });

// // FTP connection settings for Hostinger
// const ftpClient = new ftp.Client();
// const FTP_HOST = "ftp.threadnprint.com";
// const FTP_USER = "myuser";
// const FTP_PASSWORD = "mypass";
// const FTP_PORT = 21; // Standard FTP port

// // Endpoint for uploading the file
// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   try {
//     // FTP connection
//     await ftpClient.access({
//       host: FTP_HOST,
//       user: FTP_USER,
//       password: FTP_PASSWORD,
//       port: FTP_PORT,
//     });

//     // Check if the directory exists, and create it if it doesn't
//     await ftpClient.ensureDir('/public_html/uploads'); // Ensures that the directory exists or creates it

//     // Create a temporary file from the uploaded buffer
//     const tempFilePath = path.join(__dirname, `${Date.now()}_${req.file.originalname}`);
//     fs.writeFileSync(tempFilePath, req.file.buffer);

//     // Upload the file to Hostinger's 'uploads' folder
//     const remoteFilePath = `/public_html/uploads/${path.basename(tempFilePath)}`;
//     await ftpClient.uploadFrom(tempFilePath, remoteFilePath);

//     // Clean up the temporary file after uploading
//     fs.unlinkSync(tempFilePath);

//     res.status(200).send({ message: 'File uploaded successfully!', filePath: remoteFilePath });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).send('File upload failed.');
//   } finally {
//     ftpClient.close();
//   }
// });

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });




const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

cloudinary.config({
  cloud_name: "dgt9l3mde",
  api_key: "762846684321731",
  api_secret: "atAPK7H-0SX47KO_1PxNnRiFzrA",
});

const app = express();
const upload = multer();

app.use(cors()); // Allow frontend to access backend
app.use(bodyParser.json());

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  cloudinary.uploader
    .upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) {
        return res.status(500).json({ error: "File upload failed" });
      }
      res.status(200).json({ url: result.secure_url });
    })
    .end(file.buffer);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
