import { getCollection } from 'astro:content';
import { getTagSummaries } from '../lib/tags';

const siteUrl = 'https://cristian-cordero.dev';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const tags = getTagSummaries(posts);
  const urls = [
    '/',
    '/blog/',
    '/tags/',
    ...posts.map((post) => `/blog/${post.slug}/`),
    ...tags.map((tag) => `/tags/${tag.slug}/`),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
      .map((path) => `<url><loc>${siteUrl}${path}</loc></url>`)
      .join('')}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
}
