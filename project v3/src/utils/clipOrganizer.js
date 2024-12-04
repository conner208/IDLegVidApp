import path from 'path';
import fs from 'fs/promises';
import { createClip } from './videoProcessor.js';

export async function organizeClips(videoPath, textData) {
  const clips = [];
  let currentSpeaker = null;
  let currentBill = null;
  let startTime = 0;

  // Process text data to identify speakers and bills
  for (const { timestamp, text } of textData) {
    const speakerMatch = text.match(/Speaker:\s*(.+)/i);
    const billMatch = text.match(/Bill\s*(?:No\.)?\s*(\w+)/i);

    if (speakerMatch || billMatch) {
      if (currentSpeaker && currentBill) {
        clips.push({
          speaker: currentSpeaker,
          bill: currentBill,
          startTime,
          endTime: timestamp
        });
      }

      if (speakerMatch) currentSpeaker = speakerMatch[1];
      if (billMatch) currentBill = billMatch[1];
      startTime = timestamp;
    }
  }

  // Create output directories
  const outputBase = 'clips';
  await fs.mkdir(outputBase, { recursive: true });

  // Generate clips
  for (const clip of clips) {
    const sanitizedSpeaker = clip.speaker.replace(/[^a-z0-9]/gi, '_');
    const outputDir = path.join(outputBase, sanitizedSpeaker, clip.bill);
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(
      outputDir,
      `${clip.startTime}-${clip.endTime}.mp4`
    );

    await createClip(videoPath, clip.startTime, clip.endTime, outputPath);
  }
}