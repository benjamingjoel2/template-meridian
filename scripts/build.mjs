// Builds dist/ from meridian.config.mjs. No dependencies: `node scripts/build.mjs`.
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { render, themeCss } from '../src/render.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'dist');
const configPath = path.resolve(root, process.argv[2] || 'meridian.config.mjs');

const fail = (msg) => { console.error(`\n✖ Build failed: ${msg}\n`); process.exit(1); };

const { default: cfg } = await import(pathToFileURL(configPath).href);

// ── Validate the config ──────────────────────────────────────────────────────
const required = [
  'brand.name', 'place.destination', 'place.region', 'place.heroWord', 'place.coordinates',
  'contact.email', 'contact.enquireUrl', 'hero.photo', 'hero.heading',
  'fonts.display.family', 'fonts.text.family',
  ...['paper', 'paperDeep', 'accent', 'ink', 'primary', 'deep', 'deepDarker', 'highlight', 'muted'].map((c) => `colors.${c}`),
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
for (const p of required) if (!get(cfg, p)) fail(`\`${p}\` is missing or empty in ${path.basename(configPath)}`);
for (const [k, v] of Object.entries(cfg.colors)) if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) fail(`colors.${k} must be a hex colour like #1F2326 (got "${v}")`);
for (const p of cfg.places.items) for (const k of [p.bg, p.fg]) if (!(k in cfg.colors)) fail(`places item "${p.name}" uses colour "${k}", which is not a key of \`colors\``);
if (!cfg.places.items.length || !cfg.journeys.items.length || !cfg.walk.items.length || !cfg.destinations.items.length) fail('places, journeys, walk and destinations each need at least one item');

// Every referenced local file must exist.
const local = (src) => !/^(https?:)?\/\//.test(src) && !src.startsWith('data:');
const files = [
  ...Object.entries(cfg.photos).flatMap(([k, p]) => [p.src, ...[p.srcset, p.avif].filter(Boolean).flatMap((s) => s.split(',').map((x) => x.trim().split(/\s+/)[0]))].map((f) => [f, `photos.${k}`])),
  ...[cfg.fonts.display, cfg.fonts.text].flatMap((f) => f.files.map((x) => [x.src, `fonts (${f.family})`])),
];
for (const [f, where] of files) if (local(f) && !existsSync(path.join(root, f))) fail(`${where} points at "${f}", which does not exist`);

// ── Build ────────────────────────────────────────────────────────────────────
const year = String(cfg.footer?.year || new Date().getFullYear());
const css = (themeCss(cfg) + (await readFile(path.join(root, 'src/styles.css'), 'utf8'))).replace(/\s*\n\s*/g, '');
let html;
try { html = render(cfg, { css, year }); } catch (e) { fail(e.message); }

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'assets/js'), { recursive: true });
await writeFile(path.join(out, 'index.html'), html);
await cp(path.join(root, 'src/site.js'), path.join(out, 'assets/js/site.js'));
await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });

// Favicon: monogram in the highlight colour on the deep colour.
const mono = String(cfg.brand.monogram || cfg.brand.name.replace(/[^\p{L}\p{N}]/gu, '')[0] || 'M').slice(0, 2)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;');
await writeFile(path.join(out, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${cfg.colors.deep}"/><text x="16" y="22.5" text-anchor="middle" font-family="Georgia,serif" font-size="${mono.length > 1 ? 14 : 19}" fill="${cfg.colors.highlight}">${mono}</text></svg>\n`);

// ── Post-build checks ────────────────────────────────────────────────────────
const leftover = html.match(/\{(brand|destination|region|email|year)\}/);
if (leftover) fail(`unfilled token ${leftover[0]} in output`);
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.find((id, i) => ids.indexOf(id) !== i);
if (dup) fail(`duplicate id "${dup}" in output`);
for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(m[1])) fail(`link to "#${m[1]}" has no matching section id`);

const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
const placeholders = (html.match(/\[[A-Z][^\]<]{1,60}\]/g) || []).length;
console.log(`✔ Built dist/index.html (${kb} KB) for “${cfg.brand.name}”.`);
if (placeholders) console.log(`  ${placeholders} [placeholder] strings remain — replace them in ${path.basename(configPath)} before launch.`);
