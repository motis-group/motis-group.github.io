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
const FIGURE_FLOOR = 0.85;
const STAGE_FLOOR = 0.9;
const COPY = ['h1', '.lede', '.tags', '.actions'];
const VIEWS = [
  { name: 'hero-desktop-mining', scene: 'mining', width: 1440 },
  { name: 'hero-desktop-electricity', scene: 'electricity', width: 1440 },
  { name: 'hero-1100', scene: 'mining', width: 1100 },
  { name: 'hero-phone', scene: 'electricity', width: 390, height: 844, deviceScaleFactor: 2 },
];
const LAYOUTS = [{ width: 1440 }, { width: 390, height: 844, deviceScaleFactor: 2 }];
const STILL = 17;
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
        return Object.assign(g.getImageData(0, 0, c.width, c.height).data, { columns: c.width });
      })
    );
    let left = px.columns;
    let right = -1;
    let drawn = 0;
    let accent = 0;
    let differing = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (Math.max(px[i], px[i + 1], px[i + 2]) > 48) {
        drawn++;
        left = Math.min(left, (i / 4) % px.columns);
        right = Math.max(right, (i / 4) % px.columns);
      }
      if (px[i + 1] - px[i + 2] > 22 && px[i + 1] >= px[i] - 2 && px[i + 1] > 60) accent++;
      if (Math.abs(px[i] - py[i]) > 24) differing++;
    }
    return { drawn, accent, differing, span: Math.max(0, right - left + 1) / px.columns };
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

function overlap(a, b) {
  return [a, b].every((shape) =>
    shape.every(([x, y], i) => {
      const [u, v] = shape[(i + 1) % shape.length];
      const along = (points) => points.map(([px, py]) => px * (y - v) + py * (u - x));
      const [p, q] = [along(a), along(b)];
      return Math.max(...p) > Math.min(...q) && Math.max(...q) > Math.min(...p);
    })
  );
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
    await page.addStyleTag({ content: '.hero .wrap { display: none }' });
    const file = path.join(ART, `${scene}-${String(t).padStart(2, '0')}.png`);
    await page.waitForFunction(() => {
      const c = document.querySelector('.mesh canvas');
      return c.width === c.clientWidth;
    });
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

for (const { name, scene, width, height = 900, deviceScaleFactor = 1 } of VIEWS) {
  const { context, page, errors } = await open(browser, base, `?scene=${scene}&t=${AFTER_FAULT}`, { viewport: { width, height }, deviceScaleFactor });
  const file = path.join(ART, `${name}.png`);
  await page.locator('.hero').screenshot({ path: file });
  console.log(`frame ${file}`);
  if (width === 1440) {
    const fold = path.join(ART, `fold-${scene}.png`);
    await page.screenshot({ path: fold });
    console.log(`frame ${fold}`);
  }
  await page.addStyleTag({ content: '.hero .wrap { visibility: hidden }' });
  const region = async (selector) => {
    const clip = await page.locator(selector).boundingBox();
    return count(page, await page.screenshot({ clip, fullPage: true }));
  };
  for (const part of COPY) {
    const { drawn } = await region(`.hero .wrap ${part}`);
    if (drawn > 0) failures.push(`${name}: ${drawn} drawn scene pixels inside the ${part} box`);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) failures.push(`${name}: page scrolls sideways by ${overflow}px`);
  if (width === 1440) {
    const stage = await page.evaluate(() => {
      const wrap = document.querySelector('.hero .wrap');
      const pad = getComputedStyle(wrap);
      const column = wrap.clientWidth - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight);
      return document.querySelector('.mesh canvas').getBoundingClientRect().width / column;
    });
    const figure = await region('.mesh canvas');
    console.log(`${name}: stage spans ${stage.toFixed(3)} of the content column, figure spans ${figure.span.toFixed(3)} of the stage`);
    if (stage < STAGE_FLOOR) failures.push(`${name}: the stage spans ${stage.toFixed(3)} of the content column, under ${STAGE_FLOOR}`);
    if (figure.span < FIGURE_FLOOR) failures.push(`${name}: the scene spans ${figure.span.toFixed(3)} of its stage width, under ${FIGURE_FLOOR}`);
  }
  for (const e of errors) failures.push(`${name}: console error: ${e}`);
  await context.close();
}

for (const scene of SCENES) {
  const named = [];
  for (const { width, height = 900, deviceScaleFactor = 1 } of LAYOUTS) {
    const at = `${scene} at ${width}`;
    const { context, page } = await open(browser, base, `?scene=${scene}&t=${STILL}`, { viewport: { width, height }, deviceScaleFactor });
    const marks = JSON.parse((await page.locator('.mesh canvas').getAttribute('data-layout')) ?? '[]');
    const labels = marks.filter((m) => m.kind !== 'ring');
    const nodes = labels.filter((m) => m.kind === 'node').map((m) => m.text);
    named.push(nodes);
    console.log(`${at}: ${labels.length} labels, ${marks.length - labels.length} rings`);
    if (!nodes.length) failures.push(`${at}: the stage shows no node labels`);
    const hidden = named[0].filter((text) => !nodes.includes(text));
    if (hidden.length) failures.push(`${at}: node labels hidden: ${hidden.join(', ')}`);
    labels.forEach((label, i) => {
      for (const other of [...marks.filter((m) => m.kind === 'ring'), ...labels.slice(i + 1).filter((m) => m.of !== label.of)]) {
        if (overlap(label.box, other.box)) failures.push(`${at}: the ${label.text} label overlaps the ${other.text ?? other.of} ${other.kind === 'ring' ? 'ring' : 'label'}`);
      }
    });
    await context.close();
  }
}

{
  const { context, page } = await open(browser, base, '?scene=mining&t=17');
  const { differing } = await count(page, built.mining, built.electricity);
  console.log(`scenes differ at t=7 by ${differing} pixels`);
  if (differing < 2000) failures.push(`the two scenes look the same at t=7 (${differing} differing pixels)`);
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
