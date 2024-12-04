import uploadRoutes from './upload.routes.js';

export function setupRoutes(app) {
  app.use('/api', uploadRoutes);
}