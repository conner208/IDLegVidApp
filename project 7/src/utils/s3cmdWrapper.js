import { execa } from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '../../.s3cfg');

export async function uploadFile(localPath, remotePath) {
  try {
    await execa('s3cmd', [
      '-c', configPath,
      'put',
      localPath,
      `s3://${process.env.SPACES_BUCKET_NAME}/${remotePath}`
    ]);
    return `https://${process.env.SPACES_BUCKET_NAME}.nyc3.digitaloceanspaces.com/${remotePath}`;
  } catch (error) {
    console.error('s3cmd upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

export async function downloadFile(remotePath, localPath) {
  try {
    await execa('s3cmd', [
      '-c', configPath,
      'get',
      `s3://${process.env.SPACES_BUCKET_NAME}/${remotePath}`,
      localPath
    ]);
    return localPath;
  } catch (error) {
    console.error('s3cmd download error:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

export async function listFiles(prefix = '') {
  try {
    const { stdout } = await execa('s3cmd', [
      '-c', configPath,
      'ls',
      `s3://${process.env.SPACES_BUCKET_NAME}/${prefix}`
    ]);
    return stdout.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(' ');
        return parts[parts.length - 1].replace(`s3://${process.env.SPACES_BUCKET_NAME}/`, '');
      });
  } catch (error) {
    console.error('s3cmd list error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
}