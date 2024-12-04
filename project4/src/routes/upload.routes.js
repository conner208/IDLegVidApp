import express from 'express';
import { uploadController, downloadClipsController } from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadController);
router.get('/download/:sessionId', downloadClipsController);

export default router;