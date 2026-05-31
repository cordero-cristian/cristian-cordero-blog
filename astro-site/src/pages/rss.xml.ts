import { getCollection } from 'astro:content';

const siteUrl = 'https://cristian-cordero.dev';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}/`;
      return [
        '<item>',
        `<title>${escapeXml(post.data.title)}</title>`,
        `<link>${url}</link>`,
        `<guid>${url}</guid>`,
        `<pubDate>${post.data.pubDate.toUTCString()}</pubDate>`,
        post.data.description ? `<description>${escapeXml(post.data.description)}</description>` : '',
        '</item>',
      ].join('');
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>Cristian Cordero</title><link>${siteUrl}/</link><description>Network automation, Kubernetes, and cloud-native infrastructure notes.</description>${items}</channel></rss>`,
    {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    },
  );
}
