// Renders the Meridian page from the config. Pure function: config in, HTML out.

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

// The hero word is sized for a seven-letter word like the original design.
// Estimate the word's width from rough capital widths and scale down to fit;
// site.js re-checks after the web font loads.
const CAP = { I: 0.45, J: 0.5, M: 1.2, W: 1.3, ' ': 0.35 };
const REF = 6.0; // estimated width of the seven-letter reference word
export const giantScale = (word) => {
  const w = [...word.toUpperCase()].reduce((a, ch) => a + (CAP[ch] ?? 0.86), 0);
  return Math.min(1, REF / Math.max(0.1, w)).toFixed(4);
};

export function render(cfg, { css, year }) {
  const tokens = {
    brand: cfg.brand.name,
    destination: cfg.place.destination,
    region: cfg.place.region,
    email: cfg.contact.email,
    year,
  };
  // Fill {tokens} then escape.
  const fill = (s) => String(s ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in tokens ? tokens[k] : m));
  const t = (s) => esc(fill(s));
  const href = (h) => esc(fill(h || '#'));
  const enquire = href(cfg.contact.enquireUrl);

  const photo = (key) => {
    const p = cfg.photos[key];
    if (!p) throw new Error(`Unknown photo key "${key}" — add it to \`photos\` in meridian.config.mjs`);
    return p;
  };
  const typeOf = (srcset) => {
    const ext = (srcset.trim().split(/\s+/)[0].split('.').pop() || '').toLowerCase();
    return { webp: 'image/webp', avif: 'image/avif', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' }[ext];
  };
  const pic = (key, sizes, { decorative = false, eager = false } = {}) => {
    const p = photo(key);
    let s = '<picture>';
    for (const set of [p.avif, p.srcset].filter(Boolean)) {
      const ty = typeOf(set);
      s += `<source${ty ? ` type="${ty}"` : ''} srcset="${esc(set)}" sizes="${esc(sizes)}">`;
    }
    s += `<img src="${esc(p.src)}" width="${+p.w || 1200}" height="${+p.h || 800}" alt="${decorative ? '' : t(p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
    return s;
  };
  const bg = (key) => esc(photo(key).bg || 'var(--paperDeep)');

  const cols = (mod = '') => `<div class="cols ${mod}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
  const steam = '<div class="steam" aria-hidden="true"><span></span><span></span><span></span><span></span></div>';

  let sec = 0;
  const num = (label) => `${pad(++sec)} — ${t(label)}`;

  const { brand, site, place, hero, statement, walk, places, journeys, route, bleed, destinations, journal, cta, footer, nav } = cfg;
  const title = t(site.title);
  const desc = t(site.description);
  const url = site.url ? esc(site.url) : '';
  const ogImg = url && site.ogImage ? esc(new URL(photo(site.ogImage).src, site.url).href) : '';
  const heroP = photo(hero.photo);

  // ── Head ───────────────────────────────────────────────────────────────────
  const preloads = [cfg.fonts.display, cfg.fonts.text]
    .flatMap((f) => f.files.filter((x) => x.preload))
    .map((x) => `<link rel="preload" href="${esc(x.src)}" as="font" type="font/woff2" crossorigin>`).join('\n');
  const heroPreload = heroP.avif || heroP.srcset
    ? `<link rel="preload" as="image"${typeOf(heroP.avif || heroP.srcset) ? ` type="${typeOf(heroP.avif || heroP.srcset)}"` : ''} imagesrcset="${esc(heroP.avif || heroP.srcset)}" imagesizes="100vw" fetchpriority="high">`
    : `<link rel="preload" as="image" href="${esc(heroP.src)}" fetchpriority="high">`;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      Object.fromEntries(Object.entries({
        '@type': 'TravelAgency',
        '@id': url ? `${site.url}#org` : undefined,
        name: fill(brand.name),
        url: site.url || undefined,
        email: fill(cfg.contact.email) || undefined,
        description: fill(site.description),
        image: ogImg ? new URL(photo(site.ogImage).src, site.url).href : undefined,
        address: Object.values(cfg.contact.postal || {}).some(Boolean)
          ? { '@type': 'PostalAddress', ...Object.fromEntries(Object.entries(cfg.contact.postal).filter(([, v]) => v)) }
          : undefined,
        areaServed: fill(place.destination) || undefined,
      }).filter(([, v]) => v !== undefined)),
    ],
  };

  const meta = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}">`,
    url && `<link rel="canonical" href="${url}">`,
    `<meta name="theme-color" content="${esc(cfg.colors.deep)}">`,
    `<meta property="og:type" content="website"><meta property="og:site_name" content="${t(brand.name)}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">${url ? `<meta property="og:url" content="${url}">` : ''}${ogImg ? `<meta property="og:image" content="${ogImg}">` : ''}<meta name="twitter:card" content="summary_large_image">`,
  ].filter(Boolean).join('\n');

  // ── Body sections ──────────────────────────────────────────────────────────
  const heroCount = `01 / ${pad(walk.items.length)}`;
  const giant = fill(place.heroWord);

  const header = `<a class="skip" href="#main">Skip to content</a>
<header class="site-head" id="head">
<a class="wordmark" href="#main" aria-label="${t(brand.name)}, home">${t(brand.name)}</a>
<nav class="head-nav" aria-label="Primary">
${nav.links.map((l) => `<a class="nav-d" href="${href(l.href)}">${t(l.label)}</a>`).join('\n')}
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="bars" aria-hidden="true"></span><span class="menu-lbl">Menu</span></button>
<a class="btn btn-accent btn-sm head-cta" href="#enquire">${t(nav.enquireLabel)}</a>
</nav>
</header>
<nav class="menu" id="menu" aria-label="Main menu">
<div class="menu-grid">
<div>
<span class="label menu-item">${t(destinations.label)}</span>
<ol class="menu-dest">${destinations.items.map((d, i) => `<li class="menu-item" style="--i:${i}"><a href="${href(d.href)}">${t(d.name)}</a></li>`).join('')}</ol>
</div>
<div class="menu-side">
${nav.menuGroups.map((g, i) => `<div class="menu-item" style="--i:${4 + i * 2}"><span class="label">${t(g.label)}</span><ul>${g.links.map((l) => `<li><a href="${href(l.href)}">${t(l.label)}</a></li>`).join('')}</ul></div>`).join('\n')}
</div>
<div class="menu-foot menu-item" style="--i:8"><a href="mailto:${t(cfg.contact.email)}">${t(cfg.contact.email)}</a><span>${t(cfg.contact.address)}</span></div>
</div>
</nav>`;

  const heroSec = `<section class="hero hero-home">
<div class="media" style="--bg:${bg(hero.photo)}">${pic(hero.photo, '100vw', { eager: true })}</div>
${cols()}${steam}
<div class="hero-in">
<div class="hero-copy">
<span class="label">${t(hero.label)}</span>
<h1 class="h1">${t(hero.heading)}</h1>
<p class="lede" style="margin-top:16px">${t(hero.lede)}</p>
</div>
<div></div>
<p class="giant hero-giant" aria-hidden="true" style="--giant-k:${giantScale(giant)}">${esc(giant)}</p>
</div>
<div class="hero-meta" aria-hidden="true">
<div class="row"><span>${t(place.heroPlace)}</span><span class="label">${heroCount}</span></div>
<div class="row" style="border:0"><span class="label">${t(place.heroLocation)}</span><span class="label">${t(place.coordinates)}</span></div>
</div>
</section>`;

  const statementSec = `<section class="sec statement">
${cols('cols-light')}
<div class="wrap grid" style="position:relative;z-index:2">
<div class="c-1-4 span-all" data-reveal><span class="label">${num(statement.label)}</span><span class="label-sm muted">${t(place.statementCoordinates || place.coordinates)}</span></div>
<div class="c-5-12 span-all">
<h2 class="h2" data-reveal>${t(statement.text)}</h2>
<div class="stats" data-reveal>${statement.stats.map((s) => `<div><span class="h3 num">${t(s.value)}</span><p class="muted">${t(s.text)}</p></div>`).join('')}</div>
</div>
</div>
</section>`;

  const walkSec = `<section class="strip" id="walk" data-strip aria-label="${t(walk.label)}">
${cols('cols-dark')}${steam}
<div class="strip-sticky">
<div class="strip-head flex-between">
<div><span class="label hl">${num(walk.label)}</span><h2 class="h2" style="margin-top:12px;max-width:18ch">${t(walk.heading)}</h2></div>
<p class="muted" style="max-width:36ch;font-size:15px">${t(walk.intro)}</p>
</div>
<div class="strip-track" data-strip-track>
${walk.items.map((w, i) => `<div class="strip-item"><a class="strip-card" href="${href(w.href)}">
<div class="media facet zoom" style="--bg:${bg(w.photo)}">${pic(w.photo, '(min-width: 900px) 24vw, 78vw')}</div>
<div class="meta"><span class="label hl">${pad(i + 1)} · ${t(w.name)}</span><span class="label-sm">${t(w.where)}</span></div>
<h3 class="h4">${t(w.title)}</h3><p>${t(w.text)}</p></a></div>`).join('')}
</div>
<div class="strip-progress" aria-hidden="true"><i data-strip-bar></i></div>
</div>
</section>`;

  const slug = (s, i) => `place-${i + 1}`;
  const p0 = places.items[0];
  const placesSec = `<section class="split" id="places" data-split style="--split-bg:var(--${esc(p0.bg)});--split-fg:var(--${esc(p0.fg)})">
<div class="split-grid">
<div class="split-text">
<div>
<span class="label">${num(places.label)}</span>
<h2 class="h2">${t(places.heading)}</h2>
<p style="margin-top:20px;max-width:42ch">${t(places.text)}</p>
<ul class="split-list">${places.items.map((p, i) => `<li><a href="#${slug(p, i)}" data-split-link="${i}"${i === 0 ? ' class="is-on"' : ''}><span>${t(p.name)}</span><span>${pad(i + 1)}</span></a></li>`).join('')}</ul>
</div>
<a class="btn btn-ghost" href="${href(places.button.href)}" style="align-self:flex-start;margin-top:28px">${t(places.button.label)} <span class="arr" aria-hidden="true">→</span></a>
</div>
<div class="split-panels">
${places.items.map((p, i) => `<article class="split-panel" id="${slug(p, i)}" data-split-panel="${i}" data-bg="var(--${esc(p.bg)})" data-fg="var(--${esc(p.fg)})">
<div class="media" style="--bg:${bg(p.photo)}" data-reveal="img">${pic(p.photo, '(min-width: 900px) 56vw, 100vw')}</div>
<div class="panel-copy"><span class="label">${t(p.meta)}</span><h3 class="h3" style="margin-top:10px">${t(p.heading)}</h3><p>${t(p.text)}</p><a class="link-u" href="${href(p.link.href)}">${t(p.link.label)} <span class="arr" aria-hidden="true">→</span></a></div>
</article>`).join('')}
</div>
</div>
</section>`;

  const journeysSec = `<section class="sec" id="journeys">
<div class="wrap">
<div class="flex-between" style="margin-bottom:32px"><div><span class="label">${num(journeys.label)}</span><h2 class="h2" style="margin-top:12px">${t(journeys.heading)}</h2></div><p class="muted" style="max-width:40ch">${t(journeys.intro)}</p></div>
<div class="panels" data-panels>
${journeys.items.map((j, i) => `<article class="panel${i === 0 ? ' is-open' : ''}" data-panel tabindex="0" aria-label="${t(j.title)}">
<div class="media" style="--bg:${bg(j.photo)}">${pic(j.photo, '(min-width: 900px) 60vw, 100vw', { decorative: true })}</div>
<span class="label-sm top-label">${t(j.tag)}</span>
<span class="vt" aria-hidden="true">${t(j.title)}</span>
<div class="panel-in"><div class="full">
<span class="label">${t(j.length)} · ${t(j.season)}</span>
<h3 class="h2">${t(j.title)}</h3>
<p>${t(j.text)}</p>
<div class="row"><a class="btn btn-accent btn-sm" href="${href(j.href)}">${t(journeys.buttonLabel)} <span class="arr" aria-hidden="true">→</span></a><span class="label-sm">${t(j.price)}</span></div>
</div></div>
</article>`).join('')}
</div>
</div>
</section>`;

  const routeSec = `<section class="sec on-dark" id="route" style="overflow:hidden">
${cols('cols-dark')}${steam}
<div class="wrap grid" style="position:relative;z-index:2;row-gap:40px">
<div class="c-1-5 span-all">
<span class="label hl">${num(route.label)}</span>
<h2 class="h2" style="margin-top:12px">${t(route.heading)}</h2>
<p class="muted" style="margin-top:20px;max-width:40ch">${t(route.text)}</p>
<a class="btn btn-accent" href="${href(route.button.href)}" style="margin-top:28px">${t(route.button.label)} <span class="arr" aria-hidden="true">→</span></a>
</div>
<div class="c-7-12 span-all">
<ol class="legs">
${route.legs.map((l, i) => `<li><span class="n">${pad(i + 1)}</span><div>${t(l.from)} → ${t(l.to)}<small>${t(l.note)}</small></div><span class="time">${t(l.time)}</span></li>`).join('\n')}
</ol>
<p class="notice" style="margin-top:16px">${t(route.notice)}</p>
</div>
</div>
</section>`;

  const bleedSec = `<section class="bleed">
<div class="media" style="--bg:${bg(bleed.photo)}">${pic(bleed.photo, '100vw')}</div>
${cols()}
<div class="bleed-copy"><div><span class="label">${num(bleed.label)}</span><p class="display">${t(bleed.line1)}</p></div><p class="display b">${t(bleed.line2)}</p></div>
</section>`;

  const destSec = `<section class="sec" id="destinations" style="overflow:hidden">
<div class="wrap car-head"><div><span class="label">${num(destinations.label)}</span><h2 class="h2" style="margin-top:12px">${t(destinations.heading)}</h2></div>
<div class="car-nav" data-car="car-dest"><button type="button" data-dir="-1" aria-label="Previous">←</button><button type="button" data-dir="1" aria-label="Next">→</button></div></div>
<div class="car" id="car-dest" tabindex="0" role="region" aria-label="${t(destinations.heading)}">${destinations.items.map((d) => `<a class="card" href="${href(d.href)}">
<div class="media r-3x4 zoom facet" style="--bg:${bg(d.photo)}">${pic(d.photo, '(min-width: 1024px) 22vw, (min-width: 600px) 40vw, 74vw', { decorative: true })}</div>
<div class="card-t"><h3 class="h4">${t(d.name)}</h3><span class="label-sm muted">${t(d.tag)}</span></div>
<p>${t(d.area)}</p>
</a>`).join('')}</div>
</section>`;

  const journalSec = `<section class="sec on-accent" id="journal">
<div class="wrap">
<div class="flex-between" style="margin-bottom:32px"><div><span class="label">${num(journal.label)}</span><h2 class="h2" style="margin-top:12px">${t(journal.heading)}</h2></div><a class="link-u" href="${href(journal.allLink.href)}">${t(journal.allLink.label)} <span class="arr" aria-hidden="true">→</span></a></div>
<div class="cards cards-3">${journal.items.map((j) => `<a class="card" href="${href(j.href)}" data-reveal>
<div class="media r-4x3 zoom facet" style="--bg:${bg(j.photo)}">${pic(j.photo, '(min-width: 1100px) 31vw, (min-width: 600px) 48vw, 100vw', { decorative: true })}</div>
<div class="card-t"><span class="label-sm">${t(j.tag)}</span></div>
<h3 class="h3" style="margin-top:8px">${t(j.title)}</h3><p style="color:var(--ink)">${t(j.text)}</p></a>`).join('')}</div>
</div>
</section>`;

  const ctaSec = `<section class="cta" id="enquire">
<div class="media" style="--bg:${bg(cta.photo)}">${pic(cta.photo, '100vw')}</div>
<div class="cta-in">
<span class="label">${t(cta.label)}</span>
<h2 class="display" style="margin-top:14px">${t(cta.heading)}</h2>
<p>${t(cta.text)}</p>
<div class="row"><a class="btn btn-accent" href="${enquire}">${t(cta.primary)} <span class="arr" aria-hidden="true">→</span></a><a class="btn btn-ghost" href="${href(cta.secondary.href)}">${t(cta.secondary.label)}</a></div>
</div>
</section>`;

  const foot = `<footer class="foot">
<div class="wrap">
<div class="foot-grid">
${footer.columns.map((c) => `<div>${c.groups.map((g, i) => `<span class="label"${i ? ' style="margin-top:28px"' : ''}>${t(g.label)}</span><ul>${g.links.map((l) => `<li><a href="${href(l.href)}">${t(l.label)}</a></li>`).join('')}</ul>`).join('\n')}</div>`).join('\n')}
<div class="foot-box"><p class="h3">${t(footer.box.heading)}</p><p>${t(footer.box.text)}</p><div class="row"><a class="btn btn-accent" href="${enquire}">${t(footer.box.primary)} <span class="arr" aria-hidden="true">→</span></a><a class="btn btn-ghost" href="mailto:${t(cfg.contact.email)}">${t(footer.box.secondary)}</a></div></div>
</div>
<div class="foot-base"><span>${t(cfg.contact.address)}</span><a href="mailto:${t(cfg.contact.email)}">${t(cfg.contact.email)}</a><span>© ${esc(year)} ${t(brand.name)}</span></div>
</div>
</footer>`;

  return `<!doctype html>
<html lang="${esc(site.lang || 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${meta}
<link rel="icon" href="favicon.svg" type="image/svg+xml">
${preloads}
${heroPreload}
<style>${css}</style>
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body>
${header}
<main id="main">
${heroSec}
${statementSec}
${walkSec}
${placesSec}
${journeysSec}
${routeSec}
${bleedSec}
${destSec}
${journalSec}
${ctaSec}
</main>
${foot}
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
}

// CSS generated from config: colour tokens and @font-face rules.
export function themeCss(cfg) {
  const c = cfg.colors;
  const vars = Object.entries(c).map(([k, v]) => `--${k}:${v}`).join(';');
  const face = (f) => f.files.map((x) => `@font-face{font-family: '${f.family}';font-style: normal;font-weight: ${f.weight};font-display: swap;src: url(${x.src}) format('woff2')${x.unicodeRange ? `;unicode-range: ${x.unicodeRange}` : ''}}`).join('');
  const fb = (f) => {
    const b = f.fallback || {};
    return `@font-face{font-family: '${f.family} Fallback';src: ${(b.local || []).map((l) => `local('${l}')`).join(',')}${b.sizeAdjust ? `;size-adjust: ${b.sizeAdjust}` : ''}${b.ascentOverride ? `;ascent-override: ${b.ascentOverride}` : ''}${b.descentOverride ? `;descent-override: ${b.descentOverride}` : ''}}`;
  };
  const { display, text } = cfg.fonts;
  return `:root{${vars}} ${face(display)}${face(text)}${fb(display)}${fb(text)}:root{--display: '${display.family}','${display.family} Fallback',${display.fallback?.generic || 'serif'};--text: '${text.family}','${text.family} Fallback',${text.fallback?.generic || 'sans-serif'}}`;
}
