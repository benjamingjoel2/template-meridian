// ─────────────────────────────────────────────────────────────────────────────
//  Meridian · Tourground Launch Pad template
//  The ONE file to edit when launching a new brand. Everything on the page —
//  name, destination, hero word, coordinates, colours, fonts, photos, journeys,
//  contact, footer — is read from here by `npm run build`.
//
//  Any string may use these tokens; they are filled in at build time:
//    {brand}        → brand.name
//    {destination}  → place.destination
//    {region}       → place.region
//    {email}        → contact.email
//    {year}         → the current year (or footer.year, if set)
// ─────────────────────────────────────────────────────────────────────────────

export default {
  // ── Brand ──────────────────────────────────────────────────────────────────
  brand: {
    name: '[Brand name]',
    // Short form for the favicon letter (one or two characters).
    monogram: 'M',
    tagline: 'Private journeys in {destination}, planned slowly.',
  },

  // ── Site / meta tags ───────────────────────────────────────────────────────
  site: {
    // Public URL with trailing slash, e.g. 'https://example.com/'.
    // Leave empty to omit canonical / og:url tags.
    url: '',
    lang: 'en',
    title: '{brand} — {destination}, slowly',
    description: 'Private, unhurried journeys in {destination}: [what makes it special], planned around your dates by {brand}.',
    // Photo key (see `photos`) used for og:image. Needs `site.url` to be set.
    ogImage: 'hero',
  },

  // ── Destination & coordinates ──────────────────────────────────────────────
  place: {
    destination: '[Destination]',
    region: '[Region]',
    // The giant word along the bottom of the hero. Short words (5–8 letters)
    // look best; longer words are scaled down automatically to fit.
    heroWord: 'MERIDIAN',
    // Coordinates panel (top-right of the hero, desktop only).
    heroPlace: '[Landmark in hero photo]',
    heroLocation: '[Town]',
    coordinates: '00°00′N 00°00′E',
    // Smaller coordinate shown beside the first section label.
    statementCoordinates: '00°00′N 00°00′E',
  },

  // ── Contact ────────────────────────────────────────────────────────────────
  contact: {
    email: 'hello@example.com',
    address: '[Street address, Postcode City, Country]',
    // Where every "Enquire" / "Plan a journey" button goes.
    enquireUrl: 'mailto:{email}',
    // Structured-data address (JSON-LD). Leave fields empty to omit.
    postal: { streetAddress: '', postalCode: '', addressLocality: '', addressRegion: '', addressCountry: '' },
  },

  // ── Colours ────────────────────────────────────────────────────────────────
  // Every colour on the page derives from these nine tokens (translucent
  // lines, overlays and steam are mixed from them in CSS).
  colors: {
    paper: '#F4F1EA',      // main background, light text on dark
    paperDeep: '#E9E4D8',  // footer, image placeholders
    accent: '#BFD6D2',     // pale accent: primary buttons, journal ground
    ink: '#1F2326',        // body text, dark sections
    primary: '#2F5D62',    // links, focus rings, solid buttons
    deep: '#17323A',       // hero ground, dark sections, menu, theme-color
    deepDarker: '#0F2229',
    highlight: '#C49A5A',  // small labels and column lines on dark
    muted: '#5E6366',      // secondary text
  },

  // ── Fonts ──────────────────────────────────────────────────────────────────
  // `display` sets headings, the hero word and the wordmark; `text` sets the
  // rest. Files live in assets/fonts/. The fallback block tunes a local font
  // so the page does not jump while the web font loads.
  fonts: {
    display: {
      family: 'Cinzel',
      weight: '400 600',
      files: [
        { src: 'assets/fonts/cinzel-latin.woff2', unicodeRange: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD', preload: true },
        { src: 'assets/fonts/cinzel-latin-ext.woff2', unicodeRange: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
      ],
      fallback: { local: ['Times New Roman', 'Liberation Serif', 'DejaVu Serif'], sizeAdjust: '118%', ascentOverride: '86%', descentOverride: '30%', generic: 'serif' },
    },
    text: {
      family: 'Lexend',
      weight: '300 500',
      files: [
        { src: 'assets/fonts/lexend-latin.woff2', unicodeRange: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD', preload: true },
        { src: 'assets/fonts/lexend-latin-ext.woff2', unicodeRange: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
      ],
      fallback: { local: ['Arial', 'Liberation Sans', 'Helvetica'], sizeAdjust: '108%', ascentOverride: '92%', descentOverride: '24%', generic: 'system-ui,sans-serif' },
    },
  },

  // ── Photos ─────────────────────────────────────────────────────────────────
  // A library of photos referenced by key everywhere below. Replace the
  // placeholder SVGs with your own images (any format). `w`/`h` are the
  // intrinsic size (prevents layout shift); `bg` is the colour shown while the
  // photo loads. Optional `srcset` (e.g. 'img/hero-800.webp 800w, img/hero-1600.webp 1600w')
  // and `avif` (same format) enable responsive images.
  photos: {
    hero:    { src: 'assets/img/hero.svg',    w: 1600, h: 1000, bg: '#2B3B3F', alt: '[Describe the hero photo]' },
    bleed:   { src: 'assets/img/bleed.svg',   w: 1600, h: 900,  bg: '#4A5A5C', alt: '[Describe the full-width photo]' },
    cta:     { src: 'assets/img/cta.svg',     w: 1600, h: 1200, bg: '#3B4446', alt: '[Describe the closing photo]' },
    photo01: { src: 'assets/img/photo-01.svg', w: 1200, h: 1500, bg: '#5B6B66', alt: '[Describe photo 01]' },
    photo02: { src: 'assets/img/photo-02.svg', w: 1200, h: 1500, bg: '#6E6A60', alt: '[Describe photo 02]' },
    photo03: { src: 'assets/img/photo-03.svg', w: 1200, h: 1500, bg: '#4F5C66', alt: '[Describe photo 03]' },
    photo04: { src: 'assets/img/photo-04.svg', w: 1200, h: 1500, bg: '#6A5F5A', alt: '[Describe photo 04]' },
    photo05: { src: 'assets/img/photo-05.svg', w: 1200, h: 1500, bg: '#56605A', alt: '[Describe photo 05]' },
    photo06: { src: 'assets/img/photo-06.svg', w: 1200, h: 1500, bg: '#5E5A66', alt: '[Describe photo 06]' },
    photo07: { src: 'assets/img/photo-07.svg', w: 1200, h: 1500, bg: '#62685E', alt: '[Describe photo 07]' },
    photo08: { src: 'assets/img/photo-08.svg', w: 1200, h: 1500, bg: '#4E5A5E', alt: '[Describe photo 08]' },
  },

  // ── Header & menu ──────────────────────────────────────────────────────────
  nav: {
    // Desktop header links (shown from 1100px wide).
    links: [
      { label: 'Places', href: '#places' },
      { label: 'Journeys', href: '#journeys' },
      { label: 'Route', href: '#route' },
      { label: 'Destinations', href: '#destinations' },
      { label: 'Journal', href: '#journal' },
    ],
    enquireLabel: 'Enquire',
    // Full-screen menu: big numbered list = `destinations` below; these two
    // small lists sit beside it.
    menuGroups: [
      { label: 'Explore', links: [{ label: 'A walk through {destination}', href: '#walk' }, { label: 'Places to stay a while', href: '#places' }, { label: 'Route planner', href: '#route' }] },
      { label: 'Plan', links: [{ label: 'Sample journeys', href: '#journeys' }, { label: 'Journal', href: '#journal' }, { label: 'Enquire', href: '#enquire' }] },
    ],
  },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    photo: 'hero',
    label: '{region} · {destination}',
    heading: '{destination}, beyond the obvious.',
    lede: '[One or two sentences on what a journey here feels like.] Private journeys, planned slowly.',
  },

  // ── 01 · Statement ─────────────────────────────────────────────────────────
  statement: {
    label: 'The idea',
    text: '[A sentence or two that sets the mood of {destination}: where the trip begins, what changes once you leave the obvious places behind, and the pace you travel at.]',
    stats: [
      { value: '3', text: '[A fact worth a number, e.g. towns, valleys or islands]' },
      { value: '00 °C', text: '[A memorable measurement, e.g. a temperature or height]' },
      { value: '1 h', text: '[A short distance or travel time that surprises people]' },
    ],
  },

  // ── 02 · Pinned horizontal walk ────────────────────────────────────────────
  walk: {
    label: 'A walk through {destination}',
    heading: 'One stop at a time, before breakfast.',
    intro: 'Scroll along the walk: eight small moments. Each stop opens a page.',
    // Eight works best; the hero coordinates panel shows "01 / <count>".
    items: [
      { photo: 'photo01', name: '[Stop one]',   where: '[Town]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
      { photo: 'photo02', name: '[Stop two]',   where: '[Town]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
      { photo: 'photo03', name: '[Stop three]', where: '[Town]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
      { photo: 'photo04', name: '[Stop four]',  where: '[Town]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
      { photo: 'photo05', name: '[Stop five]',  where: '[Town]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
      { photo: 'photo06', name: '[Stop six]',   where: '[Town]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
      { photo: 'photo07', name: '[Stop seven]', where: '[Region]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
      { photo: 'photo08', name: '[Stop eight]', where: '[Region]', title: '[A short title]', text: '[One sentence about this stop.]', href: '#places' },
    ],
  },

  // ── 03 · Sticky split: places (ground colour changes per panel) ───────────
  places: {
    label: 'Three places',
    heading: 'Three places. Three different mornings.',
    text: '[Why these three places, and how guests usually combine them: a few nights in one, day trips to the others.]',
    button: { label: 'Plan around them', href: '#enquire' },
    // bg / fg are colour token names from `colors`.
    items: [
      { photo: 'photo01', name: '[Place one]',   meta: '[Also known as] · [About 2 h by train]', heading: '[A one-line portrait.]', text: '[Two sentences about this place.]', link: { label: '[Place one]', href: '#destinations' }, bg: 'accent', fg: 'ink' },
      { photo: 'photo02', name: '[Place two]',   meta: '[Also known as] · [About 3 h by train]', heading: '[A one-line portrait.]', text: '[Two sentences about this place.]', link: { label: '[Place two]', href: '#destinations' }, bg: 'deep', fg: 'paper' },
      { photo: 'photo03', name: '[Place three]', meta: '[Also known as] · [About 3 h by car]',   heading: '[A one-line portrait.]', text: '[Two sentences about this place.]', link: { label: '[Place three]', href: '#destinations' }, bg: 'primary', fg: 'paper' },
    ],
  },

  // ── 04 · Journeys (expanding panels) ───────────────────────────────────────
  journeys: {
    label: 'Sample journeys',
    heading: 'Four ways in.',
    intro: 'Every journey is private and planned around your dates. These are starting points. Hover or tap to open.',
    buttonLabel: 'View journey',
    items: [
      { photo: 'hero',    tag: '[Theme]', title: '[Journey one]',   length: '9 nights', season: 'All year',        text: '[Two sentences: where it starts, where it goes, what it is for.]', price: 'Priced on request', href: '#enquire' },
      { photo: 'photo04', tag: '[Theme]', title: '[Journey two]',   length: '8 nights', season: 'April–October',   text: '[Two sentences: where it starts, where it goes, what it is for.]', price: 'Priced on request', href: '#enquire' },
      { photo: 'photo05', tag: '[Theme]', title: '[Journey three]', length: '7 nights', season: 'May–October',     text: '[Two sentences: where it starts, where it goes, what it is for.]', price: 'Priced on request', href: '#enquire' },
      { photo: 'photo06', tag: '[Theme]', title: '[Journey four]',  length: '8 nights', season: 'May–October',     text: '[Two sentences: where it starts, where it goes, what it is for.]', price: 'Priced on request', href: '#enquire' },
    ],
  },

  // ── 05 · Route (dark section with travel legs) ─────────────────────────────
  route: {
    label: 'Route planner',
    heading: 'Add two or three towns to a city break. By train.',
    text: 'Choose the towns, and we draw the route with typical rail and road times and a sensible number of nights in each.',
    button: { label: 'Ask for a route', href: '#enquire' },
    legs: [
      { from: '[Gateway city]', to: '[Town one]', note: '[Direct train or coach]', time: '2 h 15' },
      { from: '[Town one]', to: '[Town two]', note: '[By car through the hills]', time: '50 min' },
      { from: '[Town two]', to: '[Gateway city]', note: '[Direct train]', time: '2 h 50' },
    ],
    notice: 'Typical times; we confirm each connection against the current timetable when we plan your trip.',
  },

  // ── 06 · Full-bleed photo with two-line display ────────────────────────────
  bleed: {
    photo: 'bleed',
    label: '[Gateway city]',
    line1: '[Gateway city] early,',
    line2: 'then somewhere slower.',
  },

  // ── 07 · Destinations carousel (also the big numbered menu list) ──────────
  destinations: {
    label: 'Destinations',
    heading: 'Where we travel',
    items: [
      { photo: 'bleed',   name: '[Destination one]',   tag: '[Theme]', area: '[Area]', href: '#enquire' },
      { photo: 'photo01', name: '[Destination two]',   tag: '[Theme]', area: '[Area]', href: '#enquire' },
      { photo: 'photo02', name: '[Destination three]', tag: '[Theme]', area: '[Area]', href: '#enquire' },
      { photo: 'photo03', name: '[Destination four]',  tag: '[Theme]', area: '[Area]', href: '#enquire' },
      { photo: 'photo04', name: '[Destination five]',  tag: '[Theme]', area: '[Area]', href: '#enquire' },
      { photo: 'photo05', name: '[Destination six]',   tag: '[Theme]', area: '[Area]', href: '#enquire' },
      { photo: 'photo06', name: '[Destination seven]', tag: '[Theme]', area: '[Area]', href: '#enquire' },
      { photo: 'photo07', name: '[Destination eight]', tag: '[Theme]', area: '[Area]', href: '#enquire' },
    ],
  },

  // ── 08 · Journal ───────────────────────────────────────────────────────────
  journal: {
    label: 'Journal',
    heading: 'Read before you pack.',
    allLink: { label: 'All stories', href: '#journal' },
    items: [
      { photo: 'photo07', tag: '[Topic] · 5 min', title: '[Story one]',   text: '[One or two sentences that make someone want to read it.]', href: '#journal' },
      { photo: 'photo08', tag: '[Topic] · 4 min', title: '[Story two]',   text: '[One or two sentences that make someone want to read it.]', href: '#journal' },
      { photo: 'photo02', tag: '[Topic] · 6 min', title: '[Story three]', text: '[One or two sentences that make someone want to read it.]', href: '#journal' },
    ],
  },

  // ── Closing call to action ────────────────────────────────────────────────
  cta: {
    photo: 'cta',
    label: 'Enquire',
    heading: 'Start with a letter.',
    text: 'Tell us roughly when, for how long and what draws you. A planner replies by email with ideas, a route and honest advice on timing.',
    primary: 'Plan a journey',
    secondary: { label: 'See sample journeys', href: '#journeys' },
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  // The base line always reads "© {year} {brand}". Set `year` to pin it;
  // leave empty to use the year of the build.
  footer: {
    year: '',
    columns: [
      { groups: [
        { label: 'Destinations', links: [{ label: '[Destination one]', href: '#destinations' }, { label: '[Destination two]', href: '#destinations' }, { label: '[Destination three]', href: '#destinations' }] },
        { label: 'Places', links: [{ label: '[Place one]', href: '#places' }, { label: '[Place two]', href: '#places' }, { label: '[Place three]', href: '#places' }] },
      ] },
      { groups: [
        { label: 'Further', links: [{ label: '[Destination four]', href: '#destinations' }, { label: '[Destination five]', href: '#destinations' }, { label: '[Destination six]', href: '#destinations' }, { label: 'All destinations', href: '#destinations' }] },
      ] },
      { groups: [
        { label: 'Explore', links: [{ label: 'The walk', href: '#walk' }, { label: 'Route planner', href: '#route' }] },
        { label: 'Plan', links: [{ label: 'Sample journeys', href: '#journeys' }, { label: 'Journal', href: '#journal' }, { label: 'Enquire', href: '#enquire' }] },
      ] },
      { groups: [
        { label: 'Legal', links: [{ label: 'Privacy Policy', href: '#' }, { label: 'Booking Terms', href: '#' }, { label: 'Cookie Policy', href: '#' }, { label: 'Photo credits', href: '#' }] },
      ] },
    ],
    box: {
      heading: 'Start with a letter',
      text: 'Tell us when you might travel and what you would like to see. We reply by email, usually within two working days, with ideas and questions rather than a brochure.',
      primary: 'Plan a journey',
      secondary: 'Email us',
    },
  },
};
