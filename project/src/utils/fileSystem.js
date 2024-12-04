import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/app.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function ensureDirectories() {
  for (const dir of config.directories) {
    await fs.mkdir(path.join(__dirname, '../../', dir), { recursive: true });
  }
}