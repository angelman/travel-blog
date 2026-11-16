import type { APIRoute } from 'astro';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const mediaRoot = path.resolve('src/assets/media');
const contentTypes: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
};

// Astro serves these endpoints in development and emits static files on build.
// Only paths enumerated from the source directory can resolve to an original.
export async function getStaticPaths() {
  const files = await readdir(mediaRoot, { recursive: true });
  return files.filter(file => /\.(jpe?g|png|webp)$/i.test(file)).map(file => ({
    params: { path: file.replaceAll('\\', '/').replace(/\.[^.]+$/, ''), ext: file.split('.').pop() },
    props: { file },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const file = props.file as string;
  const bytes = await readFile(path.join(mediaRoot, file));
  return new Response(new Uint8Array(bytes), {
    headers: { 'Content-Type': contentTypes[file.split('.').pop()!.toLowerCase()] },
  });
};
