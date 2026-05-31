import type { CollectionEntry } from 'astro:content';

export type TagSummary = {
  label: string;
  slug: string;
  posts: CollectionEntry<'blog'>[];
};

export const getTagSlug = (tag: string) =>
  tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getTagSummaries = (posts: CollectionEntry<'blog'>[]) => {
  const tagMap = new Map<string, TagSummary>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = getTagSlug(tag);
      const existing = tagMap.get(slug);

      if (existing) {
        existing.posts.push(post);
      } else {
        tagMap.set(slug, {
          label: tag,
          slug,
          posts: [post],
        });
      }
    }
  }

  return [...tagMap.values()].sort((a, b) => a.label.localeCompare(b.label));
};
