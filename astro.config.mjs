import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
export default defineConfig({ site:'https://travel.angelirizarry.com', trailingSlash:'ignore', integrations:[mdx()] });
