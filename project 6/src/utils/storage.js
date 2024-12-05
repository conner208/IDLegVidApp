import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY,
    secretAccessKey: process.env.SPACES_SECRET_KEY
  }
});

export async function uploadToSpaces(filePath, bucketName) {
  const fileName = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ACL: 'private'
    }
  });

  try {
    const result = await upload.done();
    return result.Location;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function downloadFromSpaces(bucketName, key, outputPath) {
  try {
    const { Body } = await s3Client.getObject({
      Bucket: bucketName,
      Key: key
    });

    const writeStream = fs.createWriteStream(outputPath);
    await new Promise((resolve, reject) => {
      Body.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    return outputPath;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}