import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
      const parsed = new Date(value);
      return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
    }, 'Use a valid YYYY-MM-DD date'),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().min(1),
    author: z.string().default('Angel Irizarry'),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
