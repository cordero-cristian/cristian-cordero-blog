# Astro Migration Completion Note

The site has been migrated from Hugo/Wowchemy to Astro. The production implementation lives in `astro-site/` and is the only site implementation retained in the repository.

## Final State

- Cloudflare Pages uses `astro-site` as the root directory.
- The build command is `npm run build`.
- The output directory is `dist`.
- Node.js 20 or newer is required.
- The Astro site includes the homepage, blog index, blog posts, tag pages, RSS, sitemap, 404 page, favicon, avatar, and redirects for old `/post/:slug/` URLs.

## Removed Cleanup Artifacts

- Legacy Hugo/Wowchemy source and configuration were removed.
- The old untracked Astro proof of concept was removed.
- Generated local site output, cache folders, and the old local MkDocs/Python environment were removed.
- Stale migration notes that pointed at the old proof of concept were removed.

## Validation

Before cleanup, the Astro site and Cloudflare Pages preview were validated for the launch routes, RSS, sitemap, avatar, favicon, redirects, and the visual theme refresh.

After cleanup, run this from the repository root to validate the retained implementation:

```bash
npm run astro:build
```
