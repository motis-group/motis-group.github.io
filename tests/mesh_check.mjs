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
  { name: 'hero-desktop-mining', scene: 'mining', width: 1440, fold: 'fold-mining', floor: 0.4 },
  { name: 'hero-desktop-electricity', scene: 'electricity', width: 1440, fold: 'fold-electricity', floor: 0.4 },
  { name: 'hero-1280', scene: 'mining', width: 1280, height: 800, fold: 'fold-mining-1280', floor: 0.35 },
  { name: 'hero-1100', scene: 'mining', width: 1100 },
  { name: 'hero-phone', scene: 'electricity', width: 390, height: 844, deviceScaleFactor: 2 },
];
const LAYOUTS = [{ width: 1440 }, { width: 1280, height: 800 }, { width: 390, height: 844, deviceScaleFactor: 2 }];
const STILL = 19;
const AI = {
  mining: { signer: 'METALLURGIST', card: 'Balance 4% short of the belt scale. 3 trucks buffering on the haul road. Hold the close until they upload.', act: ['LATE', 'RECONCILE'] },
  electricity: { signer: 'DISPATCHER', card: 'Fault below the recloser. 412 meters dark. Close the tie switch to restore.', act: ['STATUS'] },
};
const BEAT = { before: BEFORE_FAULT, detect: 11.7, trace: 12.9, explain: 14.5, unsigned: 14.6, sign: 14.9, act: STILL };
const LIT = 0.5;
const FLOWS = [
  { scene: 'mining', t: STILL, from: 'HAUL TRUCK', to: 'MINE NETWORK', tag: 'PAYLOADS' },
  { scene: 'mining', t: STILL, from: 'OPERATOR', to: 'PROD. REPORTING', tag: 'SHIFT REPORT' },
  { scene: 'electricity', t: STILL, from: 'TIE SWITCH', to: 'SCADA', tag: 'STATUS' },
  { scene: 'electricity', t: AFTER_FAULT, from: 'METER COMMS', to: 'METER DATA', tag: 'LAST GASP' },
  { scene: 'electricity', t: BEFORE_FAULT, from: 'METER COMMS', to: 'METER DATA', tag: 'LAST GASP', absent: true },
];
const UNNAMED = { mining: ['ERP'] };
const REFERENCE = process.env.MESH_REF;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.glb': 'model/gltf-binary' };
const CROP = 360;

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

function brightness(page, png, points) {
  return page.evaluate(async ({ data, points }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const px = g.getImageData(0, 0, c.width, c.height).data;
    return points.map(([x, y]) => {
      let best = 0;
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          const i = ((Math.round(y) + dy) * c.width + Math.round(x) + dx) * 4;
          best = Math.max(best, px[i] ?? 0, px[i + 1] ?? 0, px[i + 2] ?? 0);
        }
      return best;
    });
  }, { data: png.toString('base64'), points });
}

async function stageAt(browser, base, scene, t, options) {
  const opened = await open(browser, base, `?scene=${scene}&t=${t}`, options);
  await opened.page.waitForFunction(() => {
    const c = document.querySelector('.mesh canvas');
    return c.width === Math.floor(c.clientWidth * Math.min(devicePixelRatio, 2));
  });
  const state = await opened.page.evaluate(() => {
    const canvas = document.querySelector('.mesh canvas');
    const card = document.querySelector('.mesh-card');
    const shown = !!card && getComputedStyle(card).visibility !== 'hidden' && card.textContent.trim() !== '';
    let lines = 0;
    if (shown) {
      const range = document.createRange();
      range.selectNodeContents(card);
      lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
    }
    return {
      marks: JSON.parse(canvas.dataset.layout ?? '[]'),
      trace: JSON.parse(canvas.dataset.trace ?? '[]'),
      stage: canvas.getBoundingClientRect().toJSON(),
      card: shown ? { text: card.textContent, box: card.getBoundingClientRect().toJSON(), lines } : null,
      copy: ['h1', '.lede', '.tags', '.actions'].map((s) => [s, document.querySelector(`.hero .wrap ${s}`).getBoundingClientRect().toJSON()]),
    };
  });
  return { ...opened, ...state };
}

const corners = ({ left, top, right, bottom }, dx = 0, dy = 0) => [[left - dx, top - dy], [right - dx, top - dy], [right - dx, bottom - dy], [left - dx, bottom - dy]];

function watch(page, base, errors) {
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => !r.url().startsWith(base) && !r.url().startsWith('data:') && errors.push(`request leaves localhost: ${r.url()}`));
}

async function open(browser, base, query, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ...options });
  const page = await context.newPage();
  const errors = [];
  watch(page, base, errors);
  await page.goto(`${base}/${query}`);
  await page.waitForSelector('canvas[data-t]', { timeout: 20000 });
  await page.waitForSelector('canvas[data-models]', { timeout: 20000 }).catch(() => errors.push('the models never finished loading'));
  return { context, page, errors };
}

function models(page) {
  return page.evaluate(() => JSON.parse(document.querySelector('.mesh canvas').dataset.models ?? '{"nodes":{},"fallback":[]}'));
}

async function sheet(page, file, tiles) {
  const png = await page.evaluate(async ({ tiles, size }) => {
    const columns = Math.min(4, tiles.length);
    const c = document.createElement('canvas');
    c.width = columns * size;
    c.height = Math.ceil(tiles.length / columns) * size;
    const g = c.getContext('2d');
    g.fillStyle = '#111210';
    g.fillRect(0, 0, c.width, c.height);
    g.font = '20px monospace';
    for (const [i, { data, name }] of tiles.entries()) {
      const img = new Image();
      img.src = `data:image/png;base64,${data}`;
      await img.decode();
      const scale = Math.min(size / img.width, (size - 28) / img.height);
      const x = (i % columns) * size;
      const y = Math.floor(i / columns) * size;
      g.drawImage(img, x + (size - img.width * scale) / 2, y + 28, img.width * scale, img.height * scale);
      g.fillStyle = '#9a9a90';
      g.fillText(name, x + 8, y + 20);
    }
    return c.toDataURL('image/png').split(',')[1];
  }, { tiles, size: CROP });
  fs.writeFileSync(file, Buffer.from(png, 'base64'));
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

for (const { name, scene, width, height = 900, deviceScaleFactor = 1, fold, floor } of VIEWS) {
  const { context, page, errors } = await open(browser, base, `?scene=${scene}&t=${AFTER_FAULT}`, { viewport: { width, height }, deviceScaleFactor });
  const layout = await page.evaluate(() => {
    const box = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
    const canvas = document.querySelector('.mesh canvas');
    const marks = JSON.parse(canvas.dataset.layout ?? '[]').filter((m) => m.kind === 'node');
    const top = Math.min(...marks.map((m) => Math.min(...m.box.map(([, y]) => y))));
    return { h1: box('.hero .wrap h1'), lede: box('.hero .wrap .lede'), actions: box('.hero .wrap .actions'), stage: box('.mesh canvas'), nodes: top, view: window.innerHeight };
  });
  const { h1, lede, actions, stage } = layout;
  const beside = h1.right <= lede.left && lede.top < h1.bottom && actions.left >= h1.right;
  if (fold) {
    const file = path.join(ART, `${fold}.png`);
    await page.screenshot({ path: file });
    console.log(`frame ${file}`);
    const shown = Math.max(0, Math.min(stage.height, layout.view - stage.top)) / stage.height;
    console.log(`${name}: stage top ${stage.top.toFixed(0)} of ${layout.view}, ${(shown * 100).toFixed(0)}% of the stage above the fold, top node at ${(stage.top + layout.nodes).toFixed(0)}`);
    if (shown < floor) failures.push(`${name}: ${(shown * 100).toFixed(0)}% of the stage is above the fold, under ${floor * 100}%`);
    if (stage.top + layout.nodes > layout.view) failures.push(`${name}: the scene's top nodes sit below the fold`);
    if (!beside) failures.push(`${name}: the hero text is not in two side-by-side columns`);
  }
  if (width < 820 && lede.top < h1.bottom) failures.push(`${name}: the hero text is not stacked`);
  const file = path.join(ART, `${name}.png`);
  await page.locator('.hero').screenshot({ path: file });
  console.log(`frame ${file}`);
  await page.addStyleTag({ content: '.hero .wrap { visibility: hidden }' });
  const region = async (selector) => {
    const box = await page.locator(selector).boundingBox();
    const clip = { ...box, y: box.y + (await page.evaluate(() => window.scrollY)) };
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
  const { context, page, errors } = await open(browser, base, `?scene=${scene}&t=${STILL}`, { deviceScaleFactor: 2 });
  const { nodes, fallback } = await models(page);
  const urls = [...new Set(Object.values(nodes).flat())];
  console.log(`${scene}: ${urls.length} model files on ${Object.keys(nodes).length} nodes, fallback on ${fallback.length}`);
  if (!urls.length) failures.push(`${scene}: the scene references no model files`);
  for (const id of fallback) failures.push(`${scene}: the ${id} model fell back to the procedural one`);
  for (const url of urls) {
    const status = (await fetch(new URL(url, base))).status;
    if (status !== 200) failures.push(`${scene}: ${url} returns ${status}`);
  }
  const marks = JSON.parse((await page.locator('.mesh canvas').getAttribute('data-layout')) ?? '[]');
  const tiles = [];
  for (const id of Object.keys(nodes)) {
    const ring = marks.find((m) => m.kind === 'ring' && m.of === id);
    if (!ring) continue;
    const xs = ring.box.map(([x]) => x);
    const ys = ring.box.map(([, y]) => y);
    const canvas = await page.locator('.mesh canvas').boundingBox();
    const half = (Math.max(...xs) - Math.min(...xs)) * 0.75;
    const cx = canvas.x + (Math.max(...xs) + Math.min(...xs)) / 2;
    const bottom = canvas.y + Math.max(...ys) + half * 0.15;
    const clip = { x: Math.max(0, cx - half), y: Math.max(0, bottom - half * 2), width: half * 2, height: half * 2 };
    tiles.push({ name: id, data: (await page.screenshot({ clip, fullPage: true })).toString('base64') });
  }
  const file = path.join(ART, `models-${scene}.png`);
  if (tiles.length) await sheet(page, file, tiles);
  console.log(`frame ${file}`);
  for (const e of errors) failures.push(`${scene} models: ${e}`);
  await context.close();
}

for (const scene of SCENES) {
  const named = [];
  for (const { width, height = 900, deviceScaleFactor = 1, t } of LAYOUTS.flatMap((l) => [AFTER_FAULT, STILL].map((t) => ({ ...l, t })))) {
    const at = `${scene} at ${width} t=${t}`;
    const { context, page } = await open(browser, base, `?scene=${scene}&t=${t}`, { viewport: { width, height }, deviceScaleFactor });
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

for (const { scene, t, from, to, tag, absent } of FLOWS) {
  const { context, page } = await open(browser, base, `?scene=${scene}&t=${t}`);
  const marks = JSON.parse((await page.locator('.mesh canvas').getAttribute('data-layout')) ?? '[]');
  await context.close();
  const id = Object.fromEntries(marks.filter((m) => m.kind === 'node').map((m) => [m.text, m.of]));
  const between = [`${id[from]}>${id[to]}`, `${id[to]}>${id[from]}`];
  const shown = marks.filter((m) => m.kind === 'tag' && between.includes(m.of)).map((m) => m.text);
  const flow = `${scene} t=${t}: the ${from} to ${to} edge`;
  console.log(`${flow} shows ${shown.length ? shown.join(', ') : 'no tag'}`);
  for (const name of [from, to]) if (!id[name]) failures.push(`${scene} t=${t}: no node is labelled ${name}`);
  if (!absent && !shown.includes(tag)) failures.push(`${flow} does not show ${tag}`);
  if (absent && shown.includes(tag)) failures.push(`${flow} shows ${tag} before the fault`);
  for (const name of UNNAMED[scene] ?? []) if (id[name]) failures.push(`${scene} t=${t}: a node is still labelled ${name}`);
}

const plain = (s) => s.replace(/\s+/g, ' ').trim();
const signed = (marks) => marks.some((m) => m.kind === 'tag' && m.text === 'SIGNED');
const alpha = (marks, text) => Math.max(0, ...marks.filter((m) => m.text === text).map((m) => m.alpha ?? 0));

for (const scene of SCENES) {
  const { signer, card, act } = AI[scene];
  const shots = {};
  for (const [beat, t] of Object.entries(BEAT)) {
    const shot = await stageAt(browser, base, scene, t);
    shot.png = await shot.page.locator('.mesh canvas').screenshot();
    if (!['before', 'unsigned'].includes(beat)) await shot.page.locator('.mesh').screenshot({ path: path.join(ART, `ai-${scene}-${beat}.png`) });
    for (const e of shot.errors) failures.push(`${scene} ${beat}: console error: ${e}`);
    shots[beat] = shot;
  }
  const { before, detect, trace, explain, unsigned, sign, act: done } = shots;
  const at = (beat) => `${scene} ${beat} t=${BEAT[beat]}`;
  if (before.card) failures.push(`${at('before')}: the agent card shows before the fault`);
  if (signed(before.marks)) failures.push(`${at('before')}: SIGNED shows before the fault`);
  if (!detect.marks.some((m) => m.kind === 'node' && m.text === 'AGENT')) failures.push(`${at('detect')}: no node is labelled AGENT`);
  const [was, now] = await Promise.all([brightness(trace.page, detect.png, trace.trace), brightness(trace.page, trace.png, trace.trace)]);
  const lit = trace.trace.length ? now.filter((v, i) => v > was[i] + 30).length / trace.trace.length : 0;
  console.log(`${at('trace')}: ${(lit * 100).toFixed(0)}% of ${trace.trace.length} traced points brighter than at t=${BEAT.detect}`);
  if (trace.trace.length < 10 || lit < LIT) failures.push(`${at('trace')}: the traced edges are not brighter than at t=${BEAT.detect} (${(lit * 100).toFixed(0)}%)`);
  if (!explain.card) failures.push(`${at('explain')}: no agent card`);
  else if (plain(explain.card.text) !== plain(card)) failures.push(`${at('explain')}: the card reads "${plain(explain.card.text)}"`);
  if (!sign.marks.some((m) => m.kind === 'node' && m.text === signer)) failures.push(`${at('sign')}: no node is labelled ${signer}`);
  if (signed(unsigned.marks)) failures.push(`${at('unsigned')}: SIGNED shows before the sign beat`);
  if (!signed(sign.marks)) failures.push(`${at('sign')}: no SIGNED tag`);
  for (const text of act) {
    for (const beat of ['unsigned', 'sign']) if (alpha(shots[beat].marks, text) > 0) failures.push(`${at(beat)}: ${text} acts before the person signs`);
    if (!(alpha(done.marks, text) > 0)) failures.push(`${at('act')}: ${text} never acts after SIGNED`);
  }
  console.log(`${scene}: card ${explain.card ? `${explain.card.lines} lines` : 'missing'}, SIGNED at ${BEAT.sign}, act ${act.map((a) => `${a}=${alpha(done.marks, a)}`).join(' ')}`);
  for (const shot of Object.values(shots)) await shot.context.close();
}

for (const scene of SCENES) {
  for (const { width, height = 900, deviceScaleFactor = 1 } of LAYOUTS) {
    const shot = await stageAt(browser, base, scene, BEAT.explain, { viewport: { width, height }, deviceScaleFactor });
    const at = `${scene} card at ${width}`;
    const { card, stage, marks, copy } = shot;
    await shot.context.close();
    if (!card) {
      failures.push(`${at}: no agent card`);
      continue;
    }
    const { box } = card;
    const inside = box.left >= stage.left - 0.5 && box.right <= stage.right + 0.5 && box.top >= stage.top - 0.5 && box.bottom <= stage.bottom + 0.5;
    const below = box.top >= stage.bottom - 0.5 && box.left >= 0 && box.right <= width;
    console.log(`${at}: ${card.lines} lines, ${inside ? 'inside' : below ? 'below' : 'outside'} the stage`);
    if (!(inside || (width < 820 && below))) failures.push(`${at}: the card is not inside the stage`);
    if (width >= 820 && card.lines > 3) failures.push(`${at}: the card runs to ${card.lines} lines`);
    const shape = corners(box, stage.left, stage.top);
    for (const m of marks) if (overlap(shape, m.box)) failures.push(`${at}: the card overlaps the ${m.text ?? m.of} ${m.kind === 'ring' ? 'ring' : 'label'}`);
    for (const [name, rect] of copy) if (overlap(corners(box), corners(rect))) failures.push(`${at}: the card overlaps the hero ${name}`);
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
  watch(page, base, errors);
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
