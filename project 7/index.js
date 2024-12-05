import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './src/config/app.config.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import uploadRoutes from './src/routes/upload.routes.js';
import { ensureDirectories } from './src/utils/fileSystem.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.join(__dirname, 'src/public')));
app.use('/api', uploadRoutes);
app.use(errorHandler);

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