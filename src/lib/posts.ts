import { getCollection, type CollectionEntry } from 'astro:content';

export function postPath(post: CollectionEntry<'posts'>) {
  const { date, slug } = post.data;
  return `/${date.slice(0, 4)}/${date.slice(5, 7)}/${date.slice(8, 10)}/${slug}/`;
}

export async function getPosts() {
  const posts = await getCollection('posts');
  const paths = new Set<string>();
  for (const post of posts) {
    const path = postPath(post);
    if (paths.has(path)) throw new Error(`Duplicate post URL: ${path}`);
    paths.add(path);
  }
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date));
}
