#!/usr/bin/env node
/**
 * MIRANIMA — static page generator (development tool; the site itself has no build step).
 *
 * Reads  src/template.html, src/404.html, src/locales/*.json and site.config.js
 * Writes index.html + 404.html for Japanese at the root, and the same pair for every
 *        other language in its own folder (en/, es/, fr/, ko/, zh-hans/, zh-hant/),
 *        plus sitemap.xml.
 *
 * Usage: node tools/build.mjs
 * The generated files are committed, so Cloudflare Pages serves them as plain static files.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/* Same language set and order as the NIARIM official site. */
const ORDER = ['ja', 'en', 'es', 'fr', 'ko', 'zh-Hans', 'zh-Hant'];
const PLAY_HL = { ja: 'ja', en: 'en', es: 'es', fr: 'fr', ko: 'ko', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW' };
const CAPTURE_BASE = 'https://niarim.miranima-studio.com/assets/images/app-captures/';

const sandbox = { window: {} };
vm.runInNewContext(read('site.config.js'), sandbox);
const config = sandbox.window.MIRANIMA_CONFIG;
const SITE = config.siteUrl.replace(/\/?$/, '/');

const locales = ORDER.map((code) => JSON.parse(read(`src/locales/${code}.json`)));
const template = read('src/template.html');
const notFoundTemplate = read('src/404.html');

/* ---------- helpers ---------- */
const esc = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const withQuery = (url, key, value) => `${url}${url.includes('?') ? '&' : '?'}${key}=${encodeURIComponent(value)}`;

function render(tpl, data, label) {
  return tpl.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}|\{\{\s*([\w.]+)\s*\}\}/g, (_, raw, plain) => {
    const key = raw || plain;
    const value = get(data, key);
    if (value === undefined) throw new Error(`${label}: no value for "${key}"`);
    return raw ? String(value) : esc(value);
  });
}

/* Every locale must define exactly the keys the Japanese source defines. */
function keysOf(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' ? keysOf(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
}
const reference = keysOf(locales[0].t).sort().join('\n');
for (const l of locales) {
  const keys = keysOf(l.t).sort().join('\n');
  if (keys !== reference) {
    const a = new Set(reference.split('\n'));
    const b = new Set(keys.split('\n'));
    const missing = [...a].filter((k) => !b.has(k));
    const extra = [...b].filter((k) => !a.has(k));
    throw new Error(`${l.lang}.json keys differ — missing: ${missing.join(', ') || '-'}; extra: ${extra.join(', ') || '-'}`);
  }
}

/* Relative link from one language page to another (works on Pages and from the file system). */
const relLink = (from, to) => (from.path ? '../' : '') + to.path || './';

/* ---------- NIARIM "ball bounce" sample (same frames as the NIARIM official site demo) ---------- */
const FRAMES = [
  { cx: 18, rx: 5, t: 'translate(18 18) rotate(-40)' },
  { cx: 31, rx: 6, t: 'translate(31 32) rotate(-28) scale(.96 1.06)' },
  { cx: 43, rx: 7.5, t: 'translate(43 49) rotate(-16) scale(.92 1.12)' },
  { cx: 53, rx: 9, t: 'translate(53 64) rotate(-6) scale(.92 1.1)' },
  { cx: 62, rx: 15, t: 'translate(62 73.4) scale(1.45 .66) rotate(8)' },
  { cx: 72, rx: 9, t: 'translate(72 60) rotate(20) scale(.92 1.12)' },
  { cx: 84, rx: 7, t: 'translate(84 44) rotate(34) scale(.96 1.05)' },
  { cx: 97, rx: 6, t: 'translate(97 32) rotate(46)' },
];
const START = 4; // the squash frame: the most telling still when nothing plays

function flipbook(t) {
  const n = FRAMES.length;
  const pad = (i) => String(i + 1).padStart(2, '0');
  const defs = [
    '<clipPath id="fb-ball-clip"><circle r="10"/></clipPath>',
    '<g id="fb-ball"><circle r="10" fill="#f06858"/><g clip-path="url(#fb-ball-clip)"><rect x="-3.4" y="-14" width="6.8" height="28" fill="#f8e0a0"/><path d="M-3.4 -14v28M3.4 -14v28" stroke="#282838" stroke-width="1.1" vector-effect="non-scaling-stroke"/></g><ellipse cx="-5" cy="-4.6" rx="2.8" ry="1.3" fill="#fff" opacity=".6"/><circle r="10" fill="none" stroke="#282838" stroke-width="1.6" vector-effect="non-scaling-stroke"/></g>',
    '<g id="fb-ground"><path d="M4 80H116" stroke="#282838" stroke-width="1.6" vector-effect="non-scaling-stroke"/><path d="M14 80l-1.5-3M16 80v-3.4M18 80l1.5-3M100 80l-1.5-3M102 80v-3.4M104 80l1.5-3" stroke="#282838" stroke-width="1.2" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"/></g>',
    ...FRAMES.map((f, i) => `<g id="fb-f${i}"><ellipse class="fb-shadow" cx="${f.cx}" cy="81" rx="${f.rx}" ry="1.6"/><use href="#fb-ball" transform="${f.t}"/></g>`),
    ...FRAMES.map((f, i) => `<circle id="fb-g${i}" r="10" transform="${f.t}"/>`),
  ];
  const cells = FRAMES.map((_, i) => (
    `<li><button class="fb-cell" type="button" data-fb-cell="${i}" aria-pressed="${i === START}" aria-label="${esc(t.flip.frame.replace('{n}', i + 1))}">`
    + `<svg viewBox="0 0 120 90" aria-hidden="true" focusable="false"><use href="#fb-ground"/><use href="#fb-f${i}"/></svg>`
    + `<span class="fb-cell-no">${pad(i)}</span></button></li>`
  ));
  return [
    '        <div class="fb-stage">',
    '          <p class="label fb-label">Playback<span>8 fps</span></p>',
    `          <svg class="fb-view" viewBox="0 0 120 90" role="img" aria-labelledby="fb-title">`,
    `            <title id="fb-title">${esc(t.flip.title)}</title>`,
    `            <defs>${defs.join('')}</defs>`,
    '            <use href="#fb-ground"/>',
    `            <use class="fb-ghost fb-ghost-prev" href="#fb-g${START - 1}" data-fb-prev/>`,
    `            <use class="fb-ghost fb-ghost-next" href="#fb-g${START + 1}" data-fb-next/>`,
    `            <use href="#fb-f${START}" data-fb-current/>`,
    '          </svg>',
    '        </div>',
    '        <div class="fb-side">',
    `          <p class="label fb-strip-label">Frames<span><span data-fb-count>${pad(START)}</span> / ${String(n).padStart(2, '0')}</span></p>`,
    `          <ol class="fb-cells" aria-label="${esc(t.flip.frames)}">`,
    ...cells.map((c) => `            ${c}`),
    '          </ol>',
    '          <div class="fb-controls">',
    `            <button class="fb-btn fb-play" type="button" data-fb-play hidden><span class="fb-play-icon" aria-hidden="true"></span><span data-fb-play-label>${esc(t.flip.play)}</span></button>`,
    `            <button class="fb-btn fb-onion" type="button" data-fb-onion aria-pressed="true" hidden><span class="fb-onion-icon" aria-hidden="true"><i></i><i></i></span>${esc(t.flip.onion)}</button>`,
    '          </div>',
    `          <p class="fb-caption">${esc(t.flip.caption)}</p>`,
    '        </div>',
  ].join('\n');
}

const jsonld = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MIRANIMA',
  alternateName: 'ミラニマ',
  url: SITE,
  logo: `${SITE}assets/apple-touch-icon.png`,
  email: config.contactEmail,
  brand: { '@type': 'Brand', name: 'NIARIM', url: config.niarimUrl },
}, null, 2).replace(/^/gm, '  ');

const alternates = [
  ...locales.map((l) => `  <link rel="alternate" hreflang="${l.lang}" href="${SITE}${l.path}">`),
  `  <link rel="alternate" hreflang="x-default" href="${SITE}">`,
].join('\n');

/* ---------- write pages ---------- */
const written = [];
for (const l of locales) {
  const data = {
    ...l,
    root: l.path ? '../' : '',
    site: SITE,
    url: SITE + l.path,
    year: new Date().getFullYear(),
    fontsUrl: `https://fonts.googleapis.com/css2?${l.fonts}&display=swap`,
    niarimUrl: withQuery(config.niarimUrl, 'lang', l.niarimLang),
    legalUrl: withQuery(config.niarimLegalUrl, 'lang', l.niarimLang),
    playUrl: withQuery(config.googlePlayUrl, 'hl', PLAY_HL[l.lang]),
    captureBase: CAPTURE_BASE,
    contactEmail: config.contactEmail,
    supportEmail: config.supportEmail,
    alternates,
    jsonld,
    flipbook: flipbook(l.t),
    /* Shown on translated pages only (empty in Japanese): who replies and how, and which text prevails. */
    contactNote: l.t.contact.languageNote ? `\n          <p class="contact-note">${esc(l.t.contact.languageNote)}</p>` : '',
    translationNote: l.t.studio.translationNote ? `\n          <p class="facts-note">${l.t.studio.translationNote}</p>` : '',
    langItems: locales.map((target) => (
      `          <li><a href="${relLink(l, target)}" hreflang="${target.lang}" lang="${target.lang}"${target.lang === l.lang ? ' aria-current="page"' : ''}>${esc(target.name)}</a></li>`
    )).join('\n'),
  };
  const dir = join(ROOT, l.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), render(template, data, `${l.lang}/index.html`));
  writeFileSync(join(dir, '404.html'), render(notFoundTemplate, data, `${l.lang}/404.html`));
  written.push(`${l.path || '/'}index.html`, `${l.path || '/'}404.html`);
}

/* ---------- sitemap with language alternates ---------- */
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...locales.map((l) => [
    '  <url>',
    `    <loc>${SITE}${l.path}</loc>`,
    ...locales.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${SITE}${a.path}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}"/>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap);

console.log(`Built ${written.length} pages for ${locales.length} languages + sitemap.xml`);
