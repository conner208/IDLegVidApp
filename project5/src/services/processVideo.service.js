import path from 'path';
import fs from 'fs/promises';
import { processVideo } from '../utils/videoProcessor.js';
import { extractTextFromFrames } from '../utils/textExtractor.js';
import { organizeClips } from '../utils/clipOrganizer.js';
import { ensureDirectories } from '../utils/fileSystem.js';
import { uploadFile } from '../utils/s3cmdWrapper.js';

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
  const uploadPromises = [];
  
  const clips = await getAllClipPaths(outputDirectory);
  for (const clipPath of clips) {
    const remotePath = path.relative(process.cwd(), clipPath);
    uploadPromises.push(uploadFile(clipPath, remotePath));
  }
  
  await Promise.all(uploadPromises);
  
  return { outputDirectory };
}

async function getAllClipPaths(directory) {
  const clips = [];
  const files = await fs.readdir(directory, { withFileTypes: true });
  
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