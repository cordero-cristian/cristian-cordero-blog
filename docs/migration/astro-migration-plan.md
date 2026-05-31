# Astro Migration Plan

## 1. Current State Summary

This repository is currently migrating from a Hugo/Wowchemy site to an Astro site for `https://cristian-cordero.dev`.
The production-intended Astro implementation now lives in `astro-site/`. The older `astro-poc/` directory remains local reference material only and is not the migration target.

### Repository Shape

- Content directories:
  - `content/_index.md`: Wowchemy landing page definition.
  - `content/post/`: blog posts.
  - `content/authors/`: author profile content and avatar.
  - `content/privacy.md` and `content/terms.md`: draft legal pages.
  - `content/admin/index.md`: Wowchemy CMS page.
- Config files:
  - `config/_default/hugo.yaml`: site title, `baseURL`, pagination, permalinks, taxonomies, and Hugo security settings.
  - `config/_default/params.yaml`: appearance, SEO metadata, header/footer, date formats, repository metadata, avatar settings.
  - `config/_default/menus.yaml`: homepage anchor navigation.
  - `config/_default/languages.yaml`: English-only site config.
  - `config/_default/module.yml`: Hugo module imports.
  - `go.mod`: HugoBlox/Wowchemy module dependencies.
  - `theme.toml`: Academic/Wowchemy starter theme metadata.
- Static assets:
  - `assets/media/icon.png`
  - `content/authors/admin/avatar.jpg`
  - `static/uploads/resume.pdf` exists in the legacy source but is a placeholder and should not be migrated for launch.
  - generated `site/` output exists locally but is not part of the tracked Hugo source.
- Custom layout code:
  - `layouts/shortcodes/note.html`: custom Hugo `note` shortcode.
- Deployment-related files:
  - `.github/workflows/updater-wip.yml`: Wowchemy updater workflow, gated to `github.repository_owner == 'wowchemy'`, so it should not run for this repo owner.
  - `README.md` states Cloudflare Pages is used for hosting.
  - No committed `netlify.toml`, `vercel.json`, or Cloudflare Pages config file was found.

### Theme Dependencies

The site depends on Hugo modules from HugoBlox/Wowchemy:

- `github.com/HugoBlox/hugo-blox-builder/modules/blox-bootstrap/v5`
- `github.com/HugoBlox/hugo-blox-builder/modules/blox-plugin-netlify`

These dependencies provide the homepage blocks, Bootstrap-based theme behavior, search, contact form support, taxonomy pages, and other Wowchemy conventions.

### Homepage Structure

The homepage is defined in `content/_index.md` as a Wowchemy landing page with these sections:

- `about.avatar`: personal intro using the `admin` author profile.
- `features`: skills for Python, Network Engineering, and Leadership.
- `experience`: career timeline.
- `collection`: recent posts from `content/post`.
- `contact`: email, Calendly, LinkedIn, and Netlify form configuration.

The main navigation points to homepage anchors:

- `#about`
- `#posts`
- `#contact`

### Blog Post Structure

Current posts are Markdown files in `content/post/`:

- `intro_post.md`
- `clabernetes_crawl.md`
- `clabernets_walk.md`
- `clabernets_run.md`

Frontmatter is mostly simple YAML:

- `title`
- `date`
- optional `description`

Post bodies are standard Markdown with fenced code blocks, links, headings, and blockquotes. Some posts use the custom Hugo shortcode:

```hugo
{{< note >}}
...
{{< /note >}}
```

Current generated output shows both older Hugo-style post URLs such as `/post/clabernetes_crawl/` and newer blog URLs such as `/blog/clabernetes-crawl/`. This needs an explicit preservation strategy before production cutover.

### Automatically Migratable

The following can be migrated mechanically after approval:

- Basic Markdown body content.
- Most fenced code blocks.
- Basic post frontmatter fields:
  - `title`
  - `date` to `pubDate`
  - `description`
- Author avatar asset.
- Site metadata such as title, description, and canonical domain.
- Static assets such as `icon.png` and the author avatar. Do not migrate `resume.pdf`; it is a placeholder.
- Homepage data from Wowchemy YAML into Astro component props or local data files.
- Simple taxonomy fields if added later, such as `tags` and `categories`.

### Manual Conversion Required

The following should be converted intentionally rather than by blind copying:

- Wowchemy homepage blocks into Astro components.
- `about.avatar`, `features`, `experience`, `collection`, and `contact` block semantics.
- The Hugo `note` shortcode into either:
  - a Markdown-compatible blockquote style, or
  - an MDX `<Note>` component.
- Contact form behavior, because the current config references Netlify forms while hosting is documented as Cloudflare Pages.
- URL redirects for both `/post/.../` and `/blog/.../` legacy paths.
- Search behavior, if search is still required.
- Theme-level behavior from Wowchemy, including dark mode, syntax highlighting style, social links, metadata, RSS, sitemap, and taxonomy pages.
- Draft handling for `privacy.md` and `terms.md`.

### Unknowns And Questions

- Which URL scheme should be canonical going forward: `/blog/:slug/` or `/post/:slug/`?
- Does Cloudflare Pages currently deploy from the repo root, and what build command is configured in the Cloudflare dashboard?
- Should the homepage remain a single-page profile-style landing page, or should About/Contact become separate pages?
- Is search required for launch, or can it remain deferred?
- Should the Netlify form be removed, replaced with a mailto/Calendly-only contact section, or implemented with another provider?
- Should `privacy.md` and `terms.md` remain draft/unpublished?
- Are emoji titles acceptable long term, or should slugs and metadata normalize them while preserving display titles?
- Should the prior untracked `astro-poc/` files be discarded before cutover, or kept temporarily as reference?

## 2. Target Astro Architecture

The production-intended Astro site is additive and lives beside the Hugo site until cutover is approved. Hugo files should remain intact until the Astro preview is validated and a separate cleanup step is approved.

### Implemented Folder Layout

```text
astro-site/
  astro.config.mjs
  package.json
  package-lock.json
  tsconfig.json
  public/
    _redirects
    favicon.png
    avatar.jpg
  src/
    content.config.ts
    data/
      profile.ts
    content/
      blog/
        intro-post.md
        clabernetes-crawl.md
        clabernets-walk.md
        clabernets-run.md
    layouts/
      BaseLayout.astro
      BlogPostLayout.astro
    pages/
      index.astro
      blog/
        index.astro
        [slug].astro
      rss.xml.ts
      sitemap.xml.ts
      404.astro
    styles/
      global.css
```

This structure keeps the Astro implementation isolated from Hugo and makes the migration reversible until production cutover.

### Package Choices

Current dependencies:

- `astro`: static site framework.
- `typescript`: via Astro defaults.

Avoid unless explicitly needed later:

- React, Vue, Svelte, or other client frameworks.
- A full design system.
- A heavy component library.
- Search libraries until search is explicitly approved.

Optional after preview validation:

- `@astrojs/sitemap` if the custom sitemap route becomes insufficient.
- `@astrojs/rss` if the custom RSS route becomes insufficient.
- A Shiki-based syntax highlighting configuration if Astro defaults are insufficient.

### Styling Approach

Use plain CSS in `src/styles/global.css`, imported from `BaseLayout.astro`.

The initial styling should cover:

- readable typography for technical posts,
- code block styling,
- simple header/footer,
- homepage section spacing,
- responsive layout,
- accessible color contrast,
- minimal light/dark support if desired.

Do not recreate Wowchemy or Bootstrap. The goal is a clean technical blog, not a full visual rebuild.

### Content Collection Schema

Use an Astro content collection for blog posts.

Proposed schema:

```ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    legacyPaths: z.array(z.string()).default([]),
  }),
});
```

The four launch posts have been migrated as Markdown. Posts that require custom interactive components later can use Astro components or MDX if explicitly approved.

### Homepage Component Breakdown

Map the current Wowchemy homepage into the Astro homepage using local structured data:

- About/hero: name, avatar, short intro, and primary actions.
- Skills: three skill items from the current `features` block.
- Experience: current experience timeline from `src/data/profile.ts`.
- Recent posts: latest posts from the Astro blog collection.
- Contact: email, GitHub, LinkedIn, and Calendly.

Do not include the placeholder resume PDF in the Astro launch.

### Blog Routing Strategy

Canonical Astro routes should be:

- `/blog/`
- `/blog/[slug]/`

Slug normalization should convert current filenames to URL-friendly slugs:

- `intro_post.md` -> `intro-post`
- `clabernetes_crawl.md` -> `clabernetes-crawl`
- `clabernets_walk.md` -> `clabernets-walk`
- `clabernets_run.md` -> `clabernets-run`

Legacy Hugo URLs should redirect rather than duplicate content:

- `/post/intro_post/` -> `/blog/intro-post/`
- `/post/clabernetes_crawl/` -> `/blog/clabernetes-crawl/`
- `/post/clabernets_walk/` -> `/blog/clabernets-walk/`
- `/post/clabernets_run/` -> `/blog/clabernets-run/`

Existing generated `/blog/.../` URLs should remain valid.

### Asset Strategy

- Copy approved runtime assets into `astro-site/public/`:
  - `content/authors/admin/avatar.jpg` -> `public/avatar.jpg`
  - `assets/media/icon.png` -> `public/favicon.png` or `public/icon.png`
- Do not copy `static/uploads/resume.pdf`; it is a placeholder and is excluded from launch scope.
- Keep post-specific images colocated with content only if posts start needing them.
- Do not copy generated `site/` assets.
- Do not depend on Wowchemy-generated CSS or JavaScript.

### Deployment Strategy

The expected host is Cloudflare Pages, based on `README.md`.

Recommended Cloudflare Pages settings:

- Project root: `astro-site`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 20 or newer

If Cloudflare Pages must build from the repository root:

- Root build command: `npm install --prefix astro-site && npm run --prefix astro-site build`
- Output directory: `astro-site/dist`

Do not remove Hugo deployment settings until the Astro preview has been validated and the production cutover is approved.

### URL Preservation Strategy

URL preservation is required before production cutover.

Plan:

- Choose `/blog/:slug/` as the Astro canonical route unless the owner prefers preserving `/post/:slug/`.
- Add redirect rules for old `/post/.../` paths.
- Preserve trailing slash behavior.
- Preserve canonical domain `https://cristian-cordero.dev`.
- Add canonical links in `BaseLayout.astro` or `BlogPostLayout.astro`.
- Generate sitemap and RSS from Astro routes.
- Validate all migrated internal links so old absolute `/post/.../` links do not create avoidable redirect hops.

## 3. Migration Phases

### Phase 0 - Discovery

Status: complete.

Deliverables:

- Inventory Hugo content, config, assets, theme dependencies, homepage structure, blog structure, and deployment clues.
- Identify automatic migration candidates.
- Identify manual conversion work.
- Document unknowns and questions.

### Phase 1 - Astro Architecture Proposal

Status: complete.

Deliverables:

- Proposed Astro folder layout.
- Package choices.
- Styling approach.
- Content collection schema.
- Homepage component breakdown.
- Blog routing strategy.
- Asset strategy.
- Deployment strategy.
- URL preservation strategy.

Implementation has moved beyond this phase into `astro-site/`.

### Phase 2 - Minimal Astro Skeleton

Status: complete.

Scope:

- Create `astro-site/` skeleton.
- Add base layout, global CSS, homepage shell, and blog index/detail routes.
- Add content collection schema.
- Copy only required shared assets.
- Leave Hugo and `astro-poc/` untouched.

Implemented:

- `astro-site/astro.config.mjs`
- `astro-site/package.json`
- `astro-site/tsconfig.json`
- `astro-site/src/content.config.ts`
- `astro-site/src/layouts/BaseLayout.astro`
- `astro-site/src/layouts/BlogPostLayout.astro`
- `astro-site/src/pages/index.astro`
- `astro-site/src/pages/blog/index.astro`
- `astro-site/src/pages/blog/[slug].astro`
- `astro-site/src/styles/global.css`

Suggested commit:

```text
Add Astro site skeleton
```

### Phase 3 - Blog Content Migration

Status: complete for launch-scope posts.

Scope:

- Migrate all four launch posts.
- Normalize filenames and slugs.
- Repair malformed frontmatter in `clabernets_run.md`.
- Convert Hugo `note` shortcodes to Markdown blockquotes.
- Update old `/post/.../` internal links to canonical `/blog/.../` links.
- Add legacy path metadata.

Implemented posts:

- `intro_post.md` -> `astro-site/src/content/blog/intro-post.md`
- `clabernetes_crawl.md` -> `astro-site/src/content/blog/clabernetes-crawl.md`
- `clabernets_walk.md` -> `astro-site/src/content/blog/clabernets-walk.md`
- `clabernets_run.md` -> `astro-site/src/content/blog/clabernets-run.md`

Suggested commit:

```text
Migrate launch blog posts to Astro
```

### Phase 4 - Homepage Content Parity

Status: complete for first production preview.

Scope:

- Port about, skills, experience, recent posts, and contact sections.
- Keep design minimal.
- Use email, GitHub, LinkedIn, and Calendly links.
- Do not include a contact form for first launch.
- Do not include the placeholder resume PDF.

Implemented:

- Homepage content in `astro-site/src/pages/index.astro`.
- Profile, skills, and experience data in `astro-site/src/data/profile.ts`.

Suggested commit:

```text
Port homepage content to Astro
```

### Phase 5 - Production Readiness

Status: complete for local build; Cloudflare preview still needs review.

Scope:

- Add Cloudflare `_redirects`.
- Add sitemap and RSS.
- Add canonical tags and basic Open Graph/Twitter metadata.
- Copy approved runtime assets.
- Exclude placeholder resume PDF.
- Update root scripts and README for `astro-site`.
- Compare generated route inventory against the launch scope.

Implemented:

- `astro-site/public/_redirects`
- `astro-site/src/pages/rss.xml.ts`
- `astro-site/src/pages/sitemap.xml.ts`
- `astro-site/src/pages/404.astro`
- `astro-site/public/avatar.jpg`
- `astro-site/public/favicon.png`
- Root `package.json` scripts point to `astro-site`.
- README documents Astro and Cloudflare settings.
- `.gitignore` excludes `astro-site/node_modules/` and `astro-site/dist/`.

Suggested commit:

```text
Prepare Astro site for production preview
```

### Phase 6 - Cloudflare Preview Validation

Status: complete.

Scope:

- Configure Cloudflare Pages preview with `astro-site` as the root directory.
- Confirm build command `npm run build`, output directory `dist`, and Node.js 20+.
- Review the Cloudflare preview URL manually.
- Validate home, blog index, four post pages, RSS, sitemap, 404, favicon, avatar, and `_redirects`.
- Confirm legacy `/post/.../` URLs redirect correctly in Cloudflare.
- Compare visible homepage content against the current Hugo landing page.
- Decide whether terms/privacy pages are needed for first launch.
- Decide whether `astro-poc/`, generated `site/`, and other migration scratch files should be removed in a separate cleanup step.

Completed:

- Branch `astro-migration-poc` was pushed.
- Cloudflare Pages preview deployed successfully.
- Preview uses `astro-site` as the Pages root, with build command `npm run build`, output directory `dist`, and Node.js 20+.
- Home, blog index, post pages, RSS, sitemap, 404, favicon, avatar, and legacy redirects were manually validated in the Cloudflare preview.

Suggested commit:

```text
Validate Astro Cloudflare preview
```

### Phase 7 - Cutover Or Archive Hugo

Status: in progress.

Requires explicit approval before any production cutover or Hugo/Wowchemy removal.

Scope:

- Keep `astro-site` as the Pages root unless there is a deployment reason to move it.
- Archive or remove Hugo files only after production parity is approved.
- Update README and deployment documentation.
- Remove or archive `astro-poc/` only after it is confirmed no longer needed.

Current cutover strategy:

- Keep `astro-site/` as the Cloudflare Pages root for production unless Cloudflare exposes a concrete deployment constraint.
- Do not move Astro files to the repository root for cutover.
- Do not delete Hugo/Wowchemy source files in this phase.
- Treat any Hugo archival or deletion as a separate, explicitly approved cleanup step.

Phase 7 site polish completed:

- Added explicit blog post navigation back to `/blog/` at the top and bottom of article pages.
- Made blog post tags clickable instead of decorative text.
- Added static tag index and tag detail pages under `/tags/`.
- Added `Tags` to the primary navigation.
- Added compact clickable tags to the blog index cards.
- Included tag pages in the sitemap.
- Normalized tag pill spacing so wrapped tags have consistent height.

Scratch/reference cleanup proposal:

- `astro-poc/`: old untracked Astro proof of concept, including `node_modules/` and `dist/`. Remove after confirming no reference material is still needed.
- `site/`: generated Hugo output. Remove after confirming production no longer depends on generated Hugo artifacts.
- `.cache/`: local cache directory. Remove when doing workspace cleanup.
- `ASTRO_MIGRATION_NOTES.md`: stale note that points at `astro-poc/`; either delete it after this plan supersedes it or rewrite it to point at `astro-site/`.

Suggested commit:

```text
Switch production site to Astro
```

## 4. Risks

- URL regressions if `/post/.../` and `/blog/.../` are not reconciled before cutover.
- Search behavior may disappear unless intentionally rebuilt.
- Wowchemy homepage features may be overfit to the old theme and need manual simplification.
- Contact form behavior may not transfer cleanly from Netlify-style config to Cloudflare Pages.
- Draft legal pages may accidentally become public if content migration ignores `draft: true`.
- Prior untracked Astro files could confuse the migration boundary if they are adopted without review.
- Emoji and punctuation in titles are fine for display, but slugs should stay normalized and stable.
- Cloudflare Pages dashboard settings are not committed in the repository; the manually validated preview currently confirms the expected `astro-site` root, `npm run build` command, `dist` output directory, and Node.js 20+ settings.

## 5. URL/SEO Plan

- Keep `https://cristian-cordero.dev` as the canonical site URL.
- Use `/blog/:slug/` as the canonical route for posts.
- Add redirects from old Hugo `/post/:slug/` URLs to canonical `/blog/:slug/` URLs.
- Preserve current generated `/blog/:slug/` URLs.
- Add page titles and descriptions from content frontmatter.
- Add default metadata from `params.yaml`:
  - site type: `Person`
  - description: `A Networking Automation, Python, Engineering focused blog`
- Add canonical URL tags.
- Add Open Graph and Twitter metadata in `BaseLayout.astro`.
- Add sitemap and RSS routes.
- Include tag index and tag detail routes in the sitemap.
- Validate that internal links to old `/post/.../` paths are updated or intentionally redirected.

## 6. Deployment Plan

Current deployment documentation points to Cloudflare Pages, but no committed Cloudflare config exists.

Astro preview deployment has been validated with this Cloudflare Pages configuration:

- Branch: `astro-migration-poc`
- Root directory: `astro-site`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 20 or newer

Repository-root fallback:

```bash
npm install --prefix astro-site
npm run --prefix astro-site build
```

Do not change production deployment until:

- all launch-scope posts are migrated,
- homepage structure is validated,
- redirects are defined,
- Cloudflare preview build passes,
- route inventory is reviewed.

For production cutover, keep the same Pages configuration and point the production branch/domain at the validated Astro deployment. Keep Hugo/Wowchemy files in the repository unless a separate cleanup step is explicitly approved.

## 7. Validation Checklist

Completed locally:

- [x] `npm install --prefix astro-site` succeeds.
- [x] `npm run --prefix astro-site build` succeeds.
- [x] Homepage renders without relying on Hugo theme assets.
- [x] Blog index route exists.
- [x] Blog detail route exists.
- [x] All four launch posts render.
- [x] Code fences render.
- [x] Hugo `note` shortcodes are converted.
- [x] Canonical post URLs use `/blog/:slug/`.
- [x] Legacy URL redirect file exists at `astro-site/public/_redirects`.
- [x] Sitemap route exists.
- [x] Tag index and tag detail routes exist.
- [x] Blog post tags link to tag pages.
- [x] Blog posts include explicit back navigation to the blog index.
- [x] RSS route exists.
- [x] Placeholder resume PDF is excluded from `astro-site`.
- [x] No Hugo files are deleted or modified for cutover.

Cloudflare preview validation:

- [x] Confirm Cloudflare Pages preview settings use `astro-site`.
- [x] Cloudflare preview build passes.
- [x] Home page is manually reviewed in Cloudflare preview.
- [x] Blog index and all four posts are manually reviewed in Cloudflare preview.
- [x] `_redirects` works for all four legacy `/post/.../` URLs in Cloudflare preview.
- [x] `/rss.xml` and `/sitemap.xml` return valid XML in Cloudflare preview.
- [x] Avatar and favicon load in Cloudflare preview.
- [ ] Decide whether search remains deferred.
- [ ] Decide whether contact form remains deferred.
- [ ] Decide whether terms/privacy pages remain unpublished.
- [ ] Decide whether `astro-poc/`, generated `site/`, and other scratch files should be removed in a later cleanup.

Before production cutover:

- [x] All launch-scope posts migrated.
- [x] Launch-scope internal links checked.
- [x] All known legacy post routes redirected.
- [x] Sitemap generated.
- [x] RSS generated.
- [x] Metadata implemented.
- [x] Cloudflare preview reviewed.
- [ ] Hugo removal or archival explicitly approved.

## 8. Recommendation On Whether Astro Is Worth Continuing

Astro remains the recommended migration target for this site.

The current site is a personal technical blog with a custom homepage, profile sections, posts, code snippets, static assets, and a need for stable URLs. Astro fits that shape better than a documentation-first tool because it supports Markdown content collections, simple components, static output, and custom layouts without requiring a client-side framework.

The main condition is discipline: do not recreate Wowchemy wholesale, do not introduce React for static content, and do not delete Hugo/Wowchemy files until the Astro preview has been validated. The next phase should focus on Cloudflare preview validation and cutover readiness, not new feature work.
