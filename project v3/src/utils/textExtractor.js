import { createWorker } from 'tesseract.js';
import fs from 'fs/promises';
import path from 'path';

export async function extractTextFromFrames(framesDir) {
  const worker = await createWorker();
  const frames = await fs.readdir(framesDir);
  const textData = [];

  for (const frame of frames) {
    const framePath = path.join(framesDir, frame);
    const { data: { text } } = await worker.recognize(framePath);
    
    textData.push({
      frame,
      timestamp: parseInt(frame.match(/frame-(\d+)/)[1]),
      text
    });
  }

  await worker.terminate();
  return textData;
}