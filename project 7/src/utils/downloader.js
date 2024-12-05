import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

export async function downloadVideo(url) {
  const filename = path.basename(url);
  const outputPath = path.join('downloads', filename);

  // Create downloads directory if it doesn't exist
  await fs.mkdir('downloads', { recursive: true });

  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(outputPath));
    writer.on('error', reject);
  });
}