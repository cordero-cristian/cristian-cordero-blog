# Cristian Cordero's Blog

Source for [cristian-cordero.dev](https://cristian-cordero.dev), a personal site and blog focused on network automation, Kubernetes, telemetry, Python, and cloud-native infrastructure.

## Astro Site

The production Astro migration lives in `astro-site/`. The legacy Hugo/Wowchemy source remains in the repository until cutover is approved.

Install dependencies:

```bash
npm install --prefix astro-site
```

Run the local development server:

```bash
npm --prefix astro-site run dev
```

Build the static site:

```bash
npm --prefix astro-site run build
```

Preview a production build:

```bash
npm --prefix astro-site run preview
```

Root convenience scripts are also available:

```bash
npm run astro:dev
npm run astro:build
npm run astro:preview
```

## Cloudflare Pages

The `astro-migration-poc` branch has deployed successfully as a Cloudflare Pages preview. Keep these settings for the Astro deployment:

- Root directory: `astro-site`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 20+

The Astro build includes `/`, `/blog/`, canonical `/blog/:slug/` post URLs, `/rss.xml`, `/sitemap.xml`, `/404.html`, and Cloudflare `_redirects` for the legacy Hugo post URLs.

For production cutover, keep `astro-site` as the Pages root unless Cloudflare exposes a concrete deployment constraint. Do not move the Astro app to the repository root as part of cutover prep.

## Legacy Hugo

The existing Hugo source is retained for reference during migration:

- `content/`: legacy Markdown content
- `layouts/`: custom Hugo shortcodes/layouts
- `config/`: Wowchemy/Hugo configuration
- `static/` and `assets/`: legacy static assets

Do not remove or archive the Hugo files until production cutover or a separate cleanup step is explicitly approved.
