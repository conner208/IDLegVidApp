import path from 'path';
import { processVideo } from '../utils/videoProcessor.js';
import { extractTextFromFrames } from '../utils/textExtractor.js';
import { organizeClips } from '../utils/clipOrganizer.js';
import { ensureDirectories } from '../utils/fileSystem.js';

export async function processVideoService(videoPath) {
  await ensureDirectories();
  
  console.log('Processing video for text extraction...');
  const frames = await processVideo(videoPath);
  
  console.log('Extracting text from frames...');
  const textData = await extractTextFromFrames(frames);
  
  console.log('Organizing clips by speaker and bill...');
  const outputDirectory = await organizeClips(videoPath, textData);
  
  return { outputDirectory };
}