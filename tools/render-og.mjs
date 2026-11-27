#!/usr/bin/env node
/**
 * Renders the social share image for every language: assets/og/<lang>.png (1200×630).
 * Development tool only. Needs Playwright with Chromium (npm i -D playwright && npx playwright install chromium).
 * Usage: node tools/render-og.mjs
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ORDER = ['ja', 'en', 'es', 'fr', 'ko', 'zh-Hans', 'zh-Hant'];
const SERIF = {
  ja: '"Shippori Mincho"', en: '"Shippori Mincho"', es: '"Shippori Mincho"', fr: '"Shippori Mincho"',
  ko: '"Noto Serif KR"', 'zh-Hans': '"Noto Serif SC"', 'zh-Hant': '"Noto Serif TC"',
};
const LATIN = new Set(['en', 'es', 'fr']);
const MARK = '<svg viewBox="86 107 328 289"><g fill="none" stroke="#e3ff36" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"><path d="M99 383V126l65 103v154H99"/><path d="M401 383V126l-63 103v154h63"/><path d="M164 229l86 111 88-111"/><path d="M174 120h156l-78 132z"/></g></svg>';

const page = (l) => {
  const latin = LATIN.has(l.lang);
  return `<!doctype html><html lang="${l.lang}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${l.fonts}&display=block">
<style>
html,body{margin:0}
body{width:1200px;height:630px;background:#f5f3ed;color:#20251f;position:relative;overflow:hidden;font-family:"DM Sans",sans-serif}
.l{position:absolute;left:84px;top:78px;margin:0;font-size:15px;font-weight:600;letter-spacing:.16em;color:#5f665c;display:flex;gap:14px;align-items:center}
.l i{width:32px;height:1px;background:#20251f;display:block}
h1{position:absolute;left:80px;top:${latin ? 168 : 170}px;width:${latin ? 640 : 740}px;margin:0;font-family:${SERIF[l.lang]},serif;font-weight:500;
  font-size:${latin ? 56 : (l.lang === 'ko' ? 54 : 62)}px;line-height:${latin ? 1.14 : 1.42};letter-spacing:${latin ? '-.01em' : (l.lang === 'ko' ? '0' : '.03em')};
  font-feature-settings:${latin || l.lang === 'ko' ? 'normal' : '"palt"'};text-wrap:balance;word-break:${l.lang === 'ko' ? 'keep-all' : 'normal'}}
.ph{display:inline-block}
.f{position:absolute;left:84px;right:84px;bottom:56px;display:flex;justify-content:space-between;border-top:1px solid #d9d7cd;padding-top:18px;font-size:15px;font-weight:600;letter-spacing:.16em;color:#5f665c}
.f b{color:#20251f;letter-spacing:.22em}
.frame{position:absolute;right:80px;top:54px;width:300px;height:375px;border:1px solid #b4b7a8}
.panel{position:absolute;right:96px;top:70px;width:300px;height:375px;background:#20251f}
.panel:after{content:"";position:absolute;inset:12px;border:1px solid rgba(243,241,234,.09)}
.axis{position:absolute;left:50%;top:12px;bottom:12px;border-left:1px dashed rgba(227,255,54,.3)}
.panel svg{position:absolute;left:50%;top:50%;width:150px;transform:translate(-50%,-50%)}
</style></head><body>
<p class="l"><i></i>INDEPENDENT SOFTWARE BRAND — JAPAN</p>
<h1>${l.t.hero.title}</h1>
<div class="frame"></div>
<div class="panel"><span class="axis"></span>${MARK}</div>
<div class="f"><b>MIRANIMA</b><span>TOOLS THAT FOLLOW THE MAKER</span></div>
</body></html>`;
};

const outDir = join(ROOT, 'assets/og');
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const code of ORDER) {
  const l = JSON.parse(readFileSync(join(ROOT, `src/locales/${code}.json`), 'utf8'));
  const p = await context.newPage();
  await p.setContent(page(l), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: join(outDir, `${l.lang}.png`) });
  await p.close();
  console.log(`assets/og/${l.lang}.png`);
}
await browser.close();
