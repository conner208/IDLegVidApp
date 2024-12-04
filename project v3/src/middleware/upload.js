import busboy from 'busboy';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from '../config/app.config.js';
import bytes from 'bytes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function uploadMiddleware(req, res, next) {
  if (req.method !== 'POST') return next();

  const bb = busboy({
    headers: req.headers,
    limits: {
      fileSize: config.upload.maxFileSize,
      files: 1
    }
  });

  let uploadPath = '';
  let fileSize = 0;
  let error = null;

  bb.on('file', (name, file, info) => {
    const filename = info.filename;
    uploadPath = path.join(__dirname, '../../uploads', filename);
    const writeStream = fs.createWriteStream(uploadPath);

    file.on('data', (data) => {
      fileSize += data.length;
      if (fileSize > config.upload.maxFileSize) {
        error = new Error(`File size exceeds limit of ${bytes(config.upload.maxFileSize)}`);
        file.resume();
      }
    });

    file.pipe(writeStream);

    file.on('limit', () => {
      error = new Error(`File size exceeds limit of ${bytes(config.upload.maxFileSize)}`);
      writeStream.end();
    });

    writeStream.on('finish', () => {
      if (error) {
        fs.unlink(uploadPath, () => {});
      } else {
        req.uploadedFile = {
          path: uploadPath,
          size: fileSize,
          name: filename
        };
      }
    });
  });

  bb.on('finish', () => {
    if (error) {
      return res.status(413).json({ error: error.message });
    }
    next();
  });

  bb.on('error', (err) => {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  });

  req.pipe(bb);
}