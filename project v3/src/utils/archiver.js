import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createClipsArchive(outputDirectory) {
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  const clipsDir = path.join(__dirname, '../../', outputDirectory);
  archive.directory(clipsDir, false);
  archive.finalize();

  return archive;
}