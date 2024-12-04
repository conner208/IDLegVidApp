import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';

export async function processVideo(videoPath) {
  const framesDir = path.join('frames', path.basename(videoPath, '.mp4'));
  await fs.mkdir(framesDir, { recursive: true });

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .fps(1) // Extract 1 frame per second
      .output(path.join(framesDir, 'frame-%d.png'))
      .on('end', () => resolve(framesDir))
      .on('error', reject)
      .run();
  });
}

export async function createClip(videoPath, startTime, endTime, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}