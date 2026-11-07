// Checks that the built page never scrolls sideways at phone and tablet widths.
// Needs Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`).
import { createRequire } from 'node:module';
import { serve } from './serve.mjs';

let chromium;
try { ({ chromium } = createRequire(import.meta.url)('playwright')); }
catch { console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium'); process.exit(1); }

const widths = [320, 360, 375, 390, 414, 430, 600, 768, 1024, 1440];
const server = await serve(0);
const url = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
let bad = 0;
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 800 }, isMobile: width < 600, hasTouch: width < 600 });
  await page.goto(url, { waitUntil: 'load' });
  const r = await page.evaluate(async () => {
    // Scroll through so lazy content and pinned sections lay out.
    for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 15)); }
    scrollTo(0, 0);
    const vw = document.documentElement.clientWidth;
    const scroll = document.documentElement.scrollWidth;
    // Stricter: elements poking past the viewport that are not inside a container meant to clip or scroll.
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      let p = el.parentElement, clipped = false;
      while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') { clipped = true; break; } p = p.parentElement; }
      if (clipped) continue;
      const b = el.getBoundingClientRect();
      if (b.width && (b.right > vw + 1 || b.left < -1) && getComputedStyle(el).position !== 'fixed') offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} (${Math.round(b.left)}→${Math.round(b.right)})`);
    }
    const g = document.querySelector('.hero-giant').getBoundingClientRect();
    return { vw, scroll, offenders: offenders.slice(0, 5), giantFits: g.right <= vw + 1 };
  });
  const ok = r.scroll <= r.vw && !r.offenders.length && r.giantFits;
  if (!ok) bad++;
  console.log(`${ok ? '✔' : '✖'} ${String(width).padStart(4)}px  scrollWidth ${r.scroll} / ${r.vw}${r.giantFits ? '' : '  hero word overflows'}${r.offenders.length ? `  overflow: ${r.offenders.join(', ')}` : ''}`);
  await page.close();
}
await browser.close();
server.close();
if (bad) { console.error(`\n✖ ${bad} width(s) scroll sideways.`); process.exit(1); }
console.log('\n✔ No sideways scrolling at any width.');
