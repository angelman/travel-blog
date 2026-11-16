# Angel's Roadtrip

A personal travel blog built with Astro, with local photos, YouTube videos, and a Leaflet road-trip map.

Live site: https://travel.angelirizarry.com

## Develop locally

Use Node.js 22.23.4 or newer and npm 9.6.5 or newer. Deployment uses the latest Node.js 22 release.

```sh
git clone https://github.com/angelman/travel-blog.git
cd travel-blog
npm ci
npm run dev
```

Open the URL Astro prints, normally `http://localhost:4321`. Source changes update the preview automatically.

```sh
npm run build     # Generate the production site in dist/
npm run preview   # Preview the production build locally
```

Do not commit generated `dist/`, `.astro/`, or `node_modules/` folders.

## Where things live

| Location | Purpose |
| --- | --- |
| `src/content/posts/*.mdx` | One MDX file per post, with frontmatter metadata |
| `src/content.config.ts` | Validated post collection schema |
| `src/lib/posts.ts` | Shared post ordering and URL generation |
| `src/data/stops.json` | Ordered map stops, dates, and related post links |
| `src/pages/index.astro` | Homepage and its map preview |
| `src/pages/blog/index.astro` | Blog index |
| `src/pages/[year]/[month]/[day]/[slug].astro` | Post page template |
| `src/pages/media/[...path].[ext].ts` | Original image URLs, served in development and generated on build |
| `src/pages/map.astro` | Full map and stop popups |
| `src/layouts/Site.astro` | Navigation, footer, and shared site styling |
| `src/lib/map-style.js` and `.css` | Shared blue routes and pin styles |
| `src/assets/media/` | Source photos processed by Astro |
| `src/components/Photo.astro` and `Gallery.astro` | Responsive photos and gallery layout |
| `public/data/route.geojson` | Saved road routes and map points |
| `.github/workflows/deploy.yml` | GitHub Pages build and deployment |

## Add or edit a post

Create a file such as `src/content/posts/a-day-in-savannah.mdx`. Start with YAML frontmatter, then write in Markdown with optional components:

```markdown
---
title: "A Day in Savannah"
date: "2021-08-01"
slug: "a-day-in-savannah"
description: "A short introduction for the post listings."
categories: ["Travel"]
tags: []
---

The full story starts here. Use **bold**, *italics*, and
[links](/map/) as needed.

## An afternoon walk

Write the next section here.
```

- Use a unique lowercase, hyphenated slug and a `YYYY-MM-DD` date.
- The post template generates `/YYYY/MM/DD/slug/` from the date and slug. There is no separate path field to maintain. Match the filename to the slug for easy navigation.
- The homepage automatically displays the five latest posts. The blog index reads the same content collection.
- `description` is plain text used in post listings. `title`, `date`, `slug`, and `description` are required and validated at build time. Invalid dates and duplicate post URLs fail the build.
- `author` defaults to Angel Irizarry; `categories` and `tags` default to empty arrays. Add `author` to the frontmatter if needed.
- Markdown supports inline HTML for galleries, captions, and video embeds. Keep that markup in the post itself, without escaping it as a JSON string.
- To link a post from a map stop, add its generated URL to that stop's `posts` array.

Preserve existing dates and slugs when editing published posts to avoid breaking their URLs. Preview the post and listing links, then run `npm run build` before publishing.

## Photos and captions

Place images under `src/assets/media/YYYY/MM/`. After the frontmatter, import `Photo` from `../../components/Photo.astro`, then use a source key beginning with `/media/`:

```html
<figure>
  <Photo src="/media/2021/08/savannah.jpg"
         alt="A tree-lined street in Savannah" />
  <figcaption>An optional caption.</figcaption>
</figure>
```

Astro reads the real dimensions and generates WebP images and responsive sizes. Do not manually provide dimensions or `srcset`. Photos load lazily by default; add `priority` to an important opening photo for eager loading. Write descriptive alt text for new photos; existing empty alt text is preserved for editorial review.

Every `Photo` in a post opens the original image in a full-screen viewer when clicked. The viewer includes captions, previous/next controls, arrow-key navigation, Escape to close, and an Open original link. Original files are requested only when opened; without JavaScript, photo links still open the original directly.

Import `Gallery` from `../../components/Gallery.astro` for groups of photos:

```mdx
<Gallery>
  <li class="gallery-item"><figure>
    <Photo src="/media/2021/08/savannah.jpg" alt="A tree-lined street" gallery />
    <figcaption>An optional caption.</figcaption>
  </figure></li>
</Gallery>
```

The `gallery` prop selects smaller responsive widths for gallery cells. Keep component tags self-closing where appropriate (`<Photo />`). Plain Markdown images may use relative paths into `src/assets/` for Astro processing. Avoid raw `<img>` tags and Markdown URLs pointing to `/media/` for new post photos: they bypass this optimization.

The static endpoint in `src/pages/media/[...path].[ext].ts` serves originals at `/media/` in development and generates the same files on build. No server is required in production. A post-build script removes unreferenced duplicate hashed originals. Keep sources for URLs that should remain available. Initial builds take longer; Astro caches generated variants for subsequent local builds.

Everything under `public/` is public. Store private originals and archival video files outside the repository.

## Videos

Upload videos to YouTube as **Unlisted**, then embed their video IDs. Anyone with the link can watch and share an unlisted video.

```html
<figure>
  <iframe title="Video description"
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    width="1920" height="1080"
    style="width:100%;aspect-ratio:16/9;height:auto"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen></iframe>
  <figcaption>An optional caption.</figcaption>
</figure>
```

For portrait videos, use `aspect-ratio:9/16`, portrait dimensions, and a constrained width. Keep a separate local copy of the original video.

## Pages and design

Home, Blog, and the full map have dedicated templates under `src/pages/`. To add another static page, create an Astro page in that directory and wrap its content in the shared `Site` layout. The unused About and Contact template pages have been removed.

Navigation and footer markup live in `src/layouts/Site.astro`; shared styles live in `src/styles/site.css`. Both maps share `src/lib/map-style.js` and `src/lib/map-style.css`; change those files to keep their routes and markers consistent.

The shared layout adds canonical URLs and search/sharing metadata. Each post uses its frontmatter `description`; static pages can pass a `description` to the layout. Query parameters are excluded from canonical URLs.

## Update the map

Edit `src/data/stops.json` in travel order. A stop looks like this:

```json
{
  "name": "Savannah, GA",
  "lat": 32.0809,
  "lon": -81.0912,
  "arrival": "2021-07-31",
  "departure": "2021-08-14",
  "posts": ["/2021/08/01/a-day-in-savannah/"]
}
```

Dates are optional; provide both arrival and departure when including them. `posts` can be empty. Keep stop data limited to information intended for public display.

After changing stops, regenerate the route:

```sh
node scripts/build-routes.mjs
```

This requires internet access and calls OSRM to approximate roads between consecutive stops. Check that every segment succeeds; a failed run can leave incomplete output. Commit both `src/data/stops.json` and `public/data/route.geojson` after a successful run.

Normal builds and visitors use the saved GeoJSON and do not call OSRM. Maps load tiles from OpenStreetMap; videos load from YouTube.

## Publish changes

```sh
npm run build
git add <changed-files>
git commit -m "Describe the change"
git push origin main
```

Pushing to `main` starts the GitHub Actions deployment. Check the repository's Actions tab for success, then verify the changed pages on the live site. The workflow can also be started manually.

The production URL is configured in `astro.config.mjs`. GitHub Pages serves the generated `dist/` directory; do not commit or upload it manually.

## Content conventions

Posts use Astro's content collections and are rendered with `getCollection()` and `render()`. MDX enables reusable optimized image components alongside Markdown. See the [Astro content collections guide](https://docs.astro.build/en/guides/content-collections/) for the underlying APIs.

Existing galleries retain their HTML with the local `gallery-grid` and `gallery-item` classes, styled in `src/styles/site.css`. Normal paragraphs, headings, links, and quotes use Markdown. Map stops remain structured JSON; posts live exclusively in `src/content/posts/`.
