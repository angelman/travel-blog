import { readdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Vite also emits hashed originals for imported image metadata. Keep originals
// at their stable URLs only, removing hashed copies that no published file uses.
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const files = await readdir(dist, { recursive: true });
const output = (await Promise.all(files.filter(file => /\.(html|css|js|json|svg)$/.test(file)).map(file => readFile(path.join(dist,file),'utf8')))).join('\n');
for (const file of files.filter(file => file.startsWith('_astro/') && /\.(jpg|jpeg|png)$/i.test(file))) {
  if (!output.includes(path.basename(file))) await unlink(path.join(dist,file));
}
