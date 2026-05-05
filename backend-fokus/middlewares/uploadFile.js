const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import UUID

// Folder penyimpanan
const imageUploadsPath = path.join(__dirname, '../../../uploads/images');
const pdfUploadsPath = path.join(__dirname, '../../../uploads/pdfs');
const videoUploadsPath = path.join(__dirname, '../../../uploads/videos');

const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true }); 
  }
};

// Pastikan folder tersedia sebelum menyimpan file
ensureDirectoryExists(imageUploadsPath);
ensureDirectoryExists(pdfUploadsPath);
ensureDirectoryExists(videoUploadsPath);

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, imageUploadsPath);
    } else if (file.mimetype === 'application/pdf') {
      cb(null, pdfUploadsPath);
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, videoUploadsPath);
    } else {
      cb(new Error('Invalid file type'), null);
    }
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Ekstensi file
    const uniqueName = `${uuidv4()}${fileExtension}`; // Nama file dengan UUID
    cb(null, uniqueName);
  },
});

// Filter file berdasarkan jenis dan ukuran
const fileFilter = (req, file, cb) => {
  const fileSize = req.headers['content-length'] ? parseInt(req.headers['content-length']) : 0;
  let maxSize = 0;
  if (file.mimetype.startsWith('image/')) {
    maxSize = 5 * 1024 * 1024; // 5MB
  } else if (file.mimetype === 'application/pdf') {
    maxSize = 10 * 1024 * 1024; // 10MB
  } else if (file.mimetype.startsWith('video/')) {
    maxSize = 200 * 1024 * 1024; // 200MB
  } else {
    return cb(new Error('Only image, video files, and PDFs are allowed!'), false);
  }

  // Untuk single file upload, file.size bisa digunakan setelah file diupload ke memori, tapi pada diskStorage, gunakan req.headers['content-length']
  if (fileSize > maxSize) {
    return cb(new Error(`File size exceeds the allowed limit (${maxSize / (1024 * 1024)}MB)`), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });