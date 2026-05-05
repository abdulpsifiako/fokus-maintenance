const fs = require('fs');
const path = require('path');
const uploadMiddleware = require('../middlewares/uploadFile');

// Upload file
exports.uploadFile = (req, res, next) => {
  const upload = uploadMiddleware.single('file');
  upload(req, res, (err) => {
    if (err) {
        return res.status(403).json(
            {
                status:403,
                success:false,
                message:'File tidak dapat diunggah',
                data:null
            }
        )
    }
    if (!req.file) {
        return res.status(404).json(
            {
                status:404,
                success:false,
                message:'File tidak diunggah atau jenis file tidak valid',
                data:null
            }
        )
    }

    const filePath = req.file.path.includes('images')
      ? `${req.file.filename}`
      : `${req.file.filename}`;

    return res.status(200).json({
        status:200,
        success:true,
        message:'File berhasil diunggah',
        data:[{
            fileUrl:filePath
        }]
    })
  });
};

// Mendapatkan daftar file gambar
exports.getImages = (req, res) => {
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    const filePath = path.join(__dirname, '../../../uploads/images', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
        res.status(404).json({ error: 'File not found!' });
        }
    });
};


// Mendapatkan daftar file PDF
exports.getPdfs = (req, res) => {
  const filePath = path.join(__dirname, '../../../uploads/pdfs', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found!' });
    }
  });
};

// Mendapatkan daftar file video
// exports.getVideos = (req, res) => {
//   const filePath = path.join(__dirname, '../../../uploads/videos', req.params.filename);
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       if (!res.headersSent) {
//         return res.status(404).json({ error: "File not found!" });
//       }
//     }
//   });
// };

exports.getVideos = (req, res) => {
  const videoPath = path.join(__dirname, '../../../uploads/videos', req.params.filename);

  // Pastikan file ada
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'File not found!' });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Jika browser meminta sebagian (Range Request)
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head); // 206 = Partial Content
    file.pipe(res);
  } else {
    // Jika tidak ada Range header (download full)
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};

// Menghapus file
exports.deleteFile = (req, res) => {
  const { type, filename } = req.params;
  let folderPath = null;
  if (type === 'images') {
    folderPath = '../../../uploads/images';
  } else if (type === 'pdfs') {
    folderPath = '../../../uploads/pdfs';
  } else if (type === 'videos') {
    folderPath = '../../../uploads/videos';
  }

  if (!folderPath) {
    return res.status(400).json({ error: 'Invalid file type.' });
  }

  const filePath = path.join(__dirname, folderPath, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File not found or unable to delete.' });
    }
    res.status(200).json({ message: 'File deleted successfully.' });
  });
};