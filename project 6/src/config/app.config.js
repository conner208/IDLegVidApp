export const config = {
  port: process.env.PORT || 3000,
  upload: {
    maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
    chunkSize: 10 * 1024 * 1024, // 10MB chunks
    tempDir: '/tmp/uploads'
  },
  directories: ['/tmp/uploads', '/tmp/frames', '/tmp/clips', '/tmp/uploads/temp']
};