# Meridian — Tourground Launch Pad template

A single-page travel brand site: giant hero word, coordinates panel, thin column
lines, rising steam, a pinned horizontal walk, a sticky split whose ground colour
changes per place, expanding journey panels, a route list, a destinations carousel,
a journal and a closing call to action. Static HTML, CSS and ~5 KB of vanilla JS;
no dependencies.

Every brand-specific value lives in **one file: `meridian.config.mjs`**.

## Launch a new brand

1. **Copy the template** — create a new repo from this one (or clone it) and name it after the brand.
2. **Fill in `meridian.config.mjs`.** Work top to bottom:
   - `brand` — name and favicon monogram
   - `site` — public URL, page title and description (meta tags are built from these)
   - `place` — destination, region, **hero word**, coordinates panel text
   - `contact` — email, address, where the Enquire buttons go
   - `colors` — nine colour tokens; everything else is mixed from them
   - `fonts` — display and text typefaces (defaults: Cinzel and Lexend, included)
   - `photos` — the photo library; drop your images in `assets/img/` and point each key at a file
   - `walk`, `places`, `journeys`, `route`, `bleed`, `destinations`, `journal`, `cta` — the page content
   - `footer` — link columns and the contact box. The base line always reads
     **“© [Year] [Brand name]”**, using the build year (or `footer.year`) and `brand.name`.

   Strings can use `{brand}`, `{destination}`, `{region}`, `{email}` and `{year}`.
3. **Build:**

   ```bash
   npm run build
   ```

   The build checks the config (missing fields, bad colours, missing photo or font files,
   broken in-page links) and writes the site to `dist/`. It also tells you how many
   `[placeholder]` strings are still left.
4. **Preview** at http://localhost:4173:

   ```bash
   npm run preview
   ```

5. **Check phones** (optional, needs Playwright with Chromium). This fails if any width from 320px to 1440px scrolls sideways:

   ```bash
   npm run check:mobile
   ```

6. **Deploy** the `dist/` folder to any static host. Build command `npm run build`, output directory `dist`.

## Photos

Placeholders live in `assets/img/`. Give each photo its real `w`/`h` (prevents layout
shift), a `bg` colour close to the image (shown while it loads) and an `alt` text.
For responsive images add `srcset` (and optionally `avif`), e.g.
`srcset: 'assets/img/hero-800.webp 800w, assets/img/hero-1600.webp 1600w'`.

## Files

| Path | What it is |
| --- | --- |
| `meridian.config.mjs` | The only file you edit to launch a brand |
| `src/render.mjs` | Page markup, filled from the config |
| `src/styles.css` | Layout, type and motion (colours come from config tokens) |
| `src/site.js` | Header, menu, scroll reveals, pinned walk, split, panels, carousel |
| `scripts/build.mjs` | Validates the config and builds `dist/` |
| `scripts/serve.mjs`, `scripts/check-mobile.mjs` | Local preview and the phone-width check |
