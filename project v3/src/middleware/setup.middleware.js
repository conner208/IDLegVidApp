import express from 'express';
import { uploadMiddleware } from './upload.js';
import { errorHandler } from './errorHandler.js';

export function setupMiddleware(app) {
  app.use(express.json());
  app.use(uploadMiddleware);
  app.use(errorHandler);
}