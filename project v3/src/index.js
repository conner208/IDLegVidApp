import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/app.config.js';
import { setupMiddleware } from './middleware/setup.middleware.js';
import { setupRoutes } from './routes/index.js';
import { ensureDirectories } from './utils/fileSystem.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

async function startServer() {
  try {
    await ensureDirectories();
    app.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();