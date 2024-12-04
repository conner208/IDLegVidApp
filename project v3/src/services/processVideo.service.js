import path from 'path';
import { processVideo } from '../utils/videoProcessor.js';
import { extractTextFromFrames } from '../utils/textExtractor.js';
import { organizeClips } from '../utils/clipOrganizer.js';
import { ensureDirectories } from '../utils/fileSystem.js';
import { uploadToSpaces } from '../utils/storage.js';

export async function processVideoService(videoPath) {
  await ensureDirectories();
  
  console.log('Processing video for text extraction...');
  const frames = await processVideo(videoPath);
  
  console.log('Extracting text from frames...');
  const textData = await extractTextFromFrames(frames);
  
  console.log('Organizing clips by speaker and bill...');
  const outputDirectory = await organizeClips(videoPath, textData);
  
  // Upload processed clips to Spaces
  console.log('Uploading clips to storage...');
  const bucketName = process.env.SPACES_BUCKET_NAME;
  const uploadPromises = [];
  
  for (const clipPath of await getAllClipPaths(outputDirectory)) {
    uploadPromises.push(uploadToSpaces(clipPath, bucketName));
  }
  
  await Promise.all(uploadPromises);
  
  return { outputDirectory };
}

async function getAllClipPaths(directory) {
  const clips = [];
  const files = await fs.promises.readdir(directory, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      clips.push(...await getAllClipPaths(fullPath));
    } else if (file.name.endsWith('.mp4')) {
      clips.push(fullPath);
    }
  }
  
  return clips;
}