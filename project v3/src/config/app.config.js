export const config = {
  port: 3000,
  upload: {
    maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
    chunkSize: 10 * 1024 * 1024, // 10MB chunks
    tempDir: 'uploads/temp'
  },
  directories: ['uploads', 'frames', 'clips', 'uploads/temp']
};