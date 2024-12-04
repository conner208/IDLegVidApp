import path from 'path';
import { fileURLToPath } from 'url';
import { processVideoService } from '../services/processVideo.service.js';
import { createClipsArchive } from '../utils/archiver.js';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessions = new Map();

export async function uploadController(req, res) {
  try {
    if (!req.uploadedFile) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const sessionId = crypto.randomBytes(16).toString('hex');
    const result = await processVideoService(req.uploadedFile.path);
    
    sessions.set(sessionId, result.outputDirectory);

    res.json({ 
      message: 'Video processed successfully',
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Error in upload controller:', error);
    res.status(500).json({ 
      error: 'Error processing video',
      message: error.message 
    });
  }
}

export async function downloadClipsController(req, res) {
  try {
    const { sessionId } = req.params;
    const outputDirectory = sessions.get(sessionId);

    if (!outputDirectory) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const zipStream = await createClipsArchive(outputDirectory);
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=legislative-clips.zip');
    
    zipStream.pipe(res);
  } catch (error) {
    console.error('Error in download controller:', error);
    res.status(500).json({ 
      error: 'Error creating download',
      message: error.message 
    });
  }
}