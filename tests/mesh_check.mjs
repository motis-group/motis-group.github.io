import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const ART = path.join(ROOT, 'tests', 'out', 'mesh');
const TIMES = [1, 4, 7, 10, 13, 17];
const SCENES = ['mining', 'electricity'];
const BEFORE_FAULT = 10;
const AFTER_FAULT = 13;
const REFERENCE = process.env.MESH_REF;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(OUT, url.endsWith('/') ? url + 'index.html' : url);
    if (!file.startsWith(OUT) || !fs.existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function count(page, png, other = png) {
  return page.evaluate(async (pair) => {
    const [px, py] = await Promise.all(
      pair.map(async (data) => {
        const img = new Image();
        img.src = `data:image/png;base64,${data}`;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0);
        return g.getImageData(0, 0, c.width, c.height).data;
      })
    );
    let drawn = 0;
    let accent = 0;
    let differing = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (Math.max(px[i], px[i + 1], px[i + 2]) > 48) drawn++;
      if (px[i + 1] - px[i + 2] > 22 && px[i + 1] >= px[i] - 2 && px[i + 1] > 60) accent++;
      if (Math.abs(px[i] - py[i]) > 24) differing++;
    }
    return { drawn, accent, differing };
  }, [png.toString('base64'), other.toString('base64')]);
}

async function open(browser, base, query, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ...options });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}/${query}`);
  await page.waitForSelector('canvas[data-t]', { timeout: 20000 });
  return { context, page, errors };
}

function compare(scene, frames) {
  const refs = TIMES.map((t) => {
    const file = path.join(ART, `ref-${String(t).padStart(2, '0')}.png`);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(t), '-i', REFERENCE, '-frames:v', '1', file]);
    return file;
  });
  const inputs = [...refs, ...frames];
  const cell = inputs.map((_, i) => `[${i}:v]scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x111210[c${i}]`);
  const row = (from) => `${TIMES.map((_, i) => `[c${from + i}]`).join('')}hstack=inputs=${TIMES.length}`;
  const filter = [...cell, `${row(0)}[top]`, `${row(TIMES.length)}[bottom]`, '[top][bottom]vstack=inputs=2'].join(';');
  const file = path.join(ART, `comparison-${scene}.png`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs.flatMap((f) => ['-i', f]), '-filter_complex', filter, '-frames:v', '1', file]);
  return file;
}

const failures = [];
fs.mkdirSync(ART, { recursive: true });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome' });
const frames = {};
const built = {};

for (const scene of SCENES) {
  frames[scene] = [];
  for (const t of TIMES) {
    const { context, page, errors } = await open(browser, base, `?scene=${scene}&t=${t}`);
    await page.addStyleTag({ content: '.hero .wrap { display: none } .hero { height: 680px } .mesh { width: 100%; -webkit-mask-image: none; mask-image: none }' });
    const file = path.join(ART, `${scene}-${String(t).padStart(2, '0')}.png`);
    await page.waitForFunction(() => document.querySelector('.mesh canvas').width === 1440);
    const png = await page.locator('.mesh').screenshot({ path: file });
    frames[scene].push(file);
    if (t === 7) built[scene] = png;
    const { drawn, accent } = await count(page, png);
    console.log(`${scene} t=${t} drawn=${drawn} accent=${accent}`);
    if (t >= 4 && drawn < 2000) failures.push(`${scene} t=${t}: canvas is blank (${drawn} drawn pixels)`);
    if (t <= BEFORE_FAULT && accent > 20) failures.push(`${scene} t=${t}: accent colour before the fault (${accent} pixels)`);
    if (t >= AFTER_FAULT && accent < 200) failures.push(`${scene} t=${t}: no accent colour after the fault (${accent} pixels)`);
    for (const e of errors) failures.push(`${scene} t=${t}: console error: ${e}`);
    await context.close();
  }
}

{
  const { context, page, errors } = await open(browser, base, '?scene=mining&t=17');
  const { differing } = await count(page, built.mining, built.electricity);
  console.log(`scenes differ at t=7 by ${differing} pixels`);
  if (differing < 2000) failures.push(`the two scenes look the same at t=7 (${differing} differing pixels)`);
  await page.screenshot({ path: path.join(ART, 'hero-desktop.png') });
  for (const e of errors) failures.push(`desktop: console error: ${e}`);
  await context.close();
}

{
  const { context, page, errors } = await open(browser, base, '?scene=electricity&t=17', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.screenshot({ path: path.join(ART, 'hero-phone.png'), fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) failures.push(`phone: page scrolls sideways by ${overflow}px`);
  for (const e of errors) failures.push(`phone: console error: ${e}`);
  await context.close();
}

{
  const { context, page, errors } = await open(browser, base, '', { reducedMotion: 'reduce' });
  const first = await page.locator('.mesh').screenshot();
  await page.waitForTimeout(700);
  const second = await page.locator('.mesh').screenshot({ path: path.join(ART, 'reduced-motion.png') });
  if (!first.equals(second)) failures.push('reduced motion: the frame changes over time');
  if ((await count(page, second)).drawn < 2000) failures.push('reduced motion: canvas is blank');
  for (const e of errors) failures.push(`reduced motion: console error: ${e}`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}/`);
  await page.waitForSelector('.mesh canvas[data-scene]', { timeout: 20000 });
  const first = await page.locator('.mesh').screenshot();
  await page.waitForTimeout(3500);
  const second = await page.locator('.mesh').screenshot({ path: path.join(ART, 'live.png') });
  if (first.equals(second)) failures.push('live: the scene does not animate');
  for (const e of errors) failures.push(`live: page error: ${e}`);
  await context.close();
}

await browser.close();
server.close();

if (REFERENCE) for (const scene of SCENES) console.log(`comparison ${compare(scene, frames[scene])}`);
for (const f of failures) console.log('FAILED', f);
console.log(`${failures.length} failures`);
process.exit(failures.length ? 1 : 0);
