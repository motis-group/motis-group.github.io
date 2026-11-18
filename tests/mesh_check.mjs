import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const ART = path.join(ROOT, 'tests', 'out', 'mesh');
const TIMES = [1, 4, 7, 16, 21, 24, 30, 41];
const SCENES = ['mining', 'electricity'];
const BEFORE_FAULT = 21;
const AFTER_FAULT = 24;
const NORMAL = 16;
const RIDING = [14, 16, 18, 20];
const FADED = 44.9;
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
const STILL = 41;
const LAYER = 'AI LAYER';
const AI = {
  mining: { signer: 'METALLURGIST', card: 'Balance 4% short of the belt scale. 3 trucks buffering on the haul road. Hold the close until they upload.', act: ['LATE', 'RECONCILE'], audit: 'Signed by metallurgist · balance closed at 100.0%' },
  electricity: { signer: 'DISPATCHER', card: 'Fault below the recloser. 412 meters dark. Close the tie switch to restore.', act: ['STATUS'], audit: 'Signed by dispatcher · 412 meters restored' },
};
const BEAT = { before: BEFORE_FAULT, detect: 23.8, correlate: 26.3, trace: 29.5, explain: 31.8, recommend: 34, unsigned: 34.4, sign: 34.8, act: 39, audit: STILL };
const STEPS = ['detect', 'correlate', 'trace', 'explain', 'recommend', 'sign', 'act', 'audit'];
const SIGNALS = { telemetry: /telemetry/i, event: /event/i, record: /record/i, agent: /agent/i };
const UNIT = /\d[\d.,]*\s?(t\/h|kt|t|MW|%|min|h|kV|A|kWh)(?![\w])/;
const CHIPS = { least: 3, most: 4 };
const LIT = 0.5;
const REACH = 4;
const GROW = 1.6;
const APART = 10;
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

function count(page, png, other = png, owners = []) {
  return page.evaluate(async ({ pair, owners, reach }) => {
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
    const ink = { telemetry: 0, event: 0, record: 0, agent: 0 };
    const owned = Object.fromEntries(Object.keys(ink).map((k) => [k, { ...ink }]));
    const owner = new Map();
    for (const [x, y, signal] of owners)
      for (let dx = -reach; dx <= reach; dx++)
        for (let dy = -reach; dy <= reach; dy++) {
          const at = (Math.round(y) + dy) * px.columns + Math.round(x) + dx;
          owner.set(at, owner.has(at) && owner.get(at) !== signal ? null : signal);
        }
    const tally = (i, kind) => {
      ink[kind]++;
      const by = owner.get(i / 4);
      if (by) owned[by][kind]++;
    };
    for (let i = 0; i < px.length; i += 4) {
      if (Math.max(px[i], px[i + 1], px[i + 2]) > 48) {
        drawn++;
        left = Math.min(left, (i / 4) % px.columns);
        right = Math.max(right, (i / 4) % px.columns);
      }
      const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
      if (g - b > 22 && g >= r - 2 && g > 60) accent++;
      else if (Math.max(r, g, b) > 70) {
        if (b - r > 30 && b >= g) tally(i, 'event');
        else if (g - r > 30 && g > b && g - b < 22) tally(i, 'agent');
        else if (r - b > 40 && r > g && g > b && r - g > 12) tally(i, 'record');
        else if (Math.max(r, g, b) - Math.min(r, g, b) < 26 && Math.max(r, g, b) > 140) tally(i, 'telemetry');
      }
      if (Math.abs(px[i] - py[i]) > 24) differing++;
    }
    return { drawn, accent, differing, ink, owned, span: Math.max(0, right - left + 1) / px.columns };
  }, { pair: [png.toString('base64'), other.toString('base64')], owners, reach: REACH });
}

function along(links, marks) {
  const shown = links.filter((l) => l.alpha > 0.1);
  const dense = shown.map(({ signal, points }) => ({
    signal,
    points: points.slice(1).flatMap(([x, y], i) => {
      const [u, v] = points[i];
      const steps = Math.max(1, Math.ceil(Math.hypot(x - u, y - v)));
      return Array.from({ length: steps }, (_, k) => [u + ((x - u) * k) / steps, v + ((y - v) * k) / steps]);
    }),
  }));
  const grown = (box) => {
    const [cx, cy] = middle(box);
    return box.map(([x, y]) => [cx + (x - cx) * GROW, cy + (y - cy) * GROW]);
  };
  const clear = marks.map((m) => (m.kind === 'ring' ? grown(m.box) : m.box));
  return dense.flatMap(({ signal, points }) =>
    points
      .filter((p) => !clear.some((box) => inside(p, box)))
      .filter(([x, y]) => !dense.some((o) => o.signal !== signal && o.points.some(([u, v]) => Math.hypot(x - u, y - v) < APART)))
      .map(([x, y]) => [x, y, signal])
  );
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
    const say = card?.querySelector('.mesh-say');
    const shown = !!say && getComputedStyle(card).visibility !== 'hidden' && say.textContent.trim() !== '';
    let lines = 0;
    if (shown) {
      const range = document.createRange();
      range.selectNodeContents(say);
      lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
    }
    const step = shown ? card.querySelector('.mesh-steps .on')?.textContent ?? null : null;
    const chips = [...document.querySelectorAll('.mesh-chip')]
      .filter((c) => getComputedStyle(c).visibility !== 'hidden' && Number(getComputedStyle(c).opacity) > 0.05)
      .map((c) => ({ text: c.textContent, box: c.getBoundingClientRect().toJSON() }));
    const key = [...document.querySelectorAll('.mesh-key li')].map((li) => li.textContent);
    return {
      marks: JSON.parse(canvas.dataset.layout ?? '[]'),
      links: JSON.parse(canvas.dataset.links ?? '[]'),
      zones: JSON.parse(canvas.dataset.zones ?? '[]'),
      trace: JSON.parse(canvas.dataset.trace ?? '[]'),
      stage: canvas.getBoundingClientRect().toJSON(),
      card: shown ? { text: say.textContent, step, box: card.getBoundingClientRect().toJSON(), lines } : null,
      chips,
      key,
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

const middle = (box) => [0, 1].map((k) => box.reduce((sum, p) => sum + p[k], 0) / box.length);

function inside([x, y], polygon) {
  const turns = polygon.map(([ax, ay], i) => {
    const [bx, by] = polygon[(i + 1) % polygon.length];
    return Math.sign((bx - ax) * (y - ay) - (by - ay) * (x - ax));
  });
  return turns.every((s) => s >= 0) || turns.every((s) => s <= 0);
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

for (const scene of SCENES) {
  const faded = await stageAt(browser, base, scene, FADED);
  const { drawn: left } = await count(faded.page, await faded.page.locator('.mesh canvas').screenshot());
  console.log(`${scene} t=${FADED}: ${left} drawn pixels after the fade`);
  if (left > 2000) failures.push(`${scene} t=${FADED}: the scene has not faded before the loop ends`);
  await faded.context.close();
  const normal = await stageAt(browser, base, scene, NORMAL);
  await normal.page.addStyleTag({ content: '.mesh-chips, .mesh-chips * { visibility: hidden !important }' });
  const owners = along(normal.links, normal.marks);
  const { owned, accent } = await count(normal.page, await normal.page.locator('.mesh canvas').screenshot(), undefined, owners);
  for (const [signal, inks] of Object.entries(owned)) {
    const own = inks[signal];
    const [rival, most] = Object.entries(inks).filter(([k]) => k !== signal).sort((a, b) => b[1] - a[1])[0];
    console.log(`${scene} normal t=${NORMAL}: near ${signal} links ${Object.entries(inks).map(([k, v]) => `${k}=${v}`).join(' ')}`);
    if (own < 40) failures.push(`${scene} normal t=${NORMAL}: the ${signal} links and packets do not render in the ${signal} colour (${own} pixels)`);
    else if (own < 2 * most) failures.push(`${scene} normal t=${NORMAL}: the ${signal} links render as much in the ${rival} colour (${most}) as in their own (${own})`);
  }
  console.log(`${scene} normal t=${NORMAL}: olive=${accent}`);
  if (accent > 20) failures.push(`${scene} normal t=${NORMAL}: olive renders before the fault (${accent} pixels)`);
  for (const [signal, pattern] of Object.entries(SIGNALS)) if (!normal.key.some((k) => pattern.test(k))) failures.push(`${scene}: the legend does not name the ${signal} signals (${normal.key.join(' | ') || 'no legend'})`);
  await normal.context.close();
}

for (const scene of SCENES) {
  let most = 0;
  for (const { width, height = 900, deviceScaleFactor = 1, t } of LAYOUTS.flatMap((l) => RIDING.map((t) => ({ ...l, t })))) {
    const shot = await stageAt(browser, base, scene, t, { viewport: { width, height }, deviceScaleFactor });
    const at = `${scene} chips at ${width} t=${t}`;
    const { chips, marks, stage } = shot;
    const valued = chips.filter((c) => UNIT.test(c.text));
    console.log(`${at}: ${chips.map((c) => c.text).join(' | ') || 'none'}`);
    if (width === 1440 && valued.length > most) {
      most = valued.length;
      await shot.page.locator('.mesh').screenshot({ path: path.join(ART, `normal-${scene}.png`) });
    }
    if (chips.length > CHIPS.most) failures.push(`${at}: ${chips.length} chips at once, want at most ${CHIPS.most}`);
    chips.forEach((chip, i) => {
      const shape = corners(chip.box, stage.left, stage.top);
      for (const m of marks) if (overlap(shape, m.box)) failures.push(`${at}: the ${chip.text} chip overlaps the ${m.text ?? m.of} ${m.kind === 'ring' ? 'ring' : 'label'}`);
      for (const other of chips.slice(i + 1)) if (overlap(corners(chip.box), corners(other.box))) failures.push(`${at}: the ${chip.text} chip overlaps the ${other.text} chip`);
    });
    await shot.context.close();
  }
  if (most < CHIPS.least) failures.push(`${scene} at 1440: at most ${most} value chips with units at t=${RIDING.join(', ')}, want ${CHIPS.least}`);
  const after = await stageAt(browser, base, scene, AFTER_FAULT);
  if (after.chips.length) failures.push(`${scene} t=${AFTER_FAULT}: value chips ride after the fault (${after.chips.map((c) => c.text).join(', ')})`);
  await after.context.close();
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
  const { before, detect, trace, explain, unsigned, sign, act: done, audit } = shots;
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
  for (const beat of STEPS) {
    const step = shots[beat].card?.step?.trim().toLowerCase();
    console.log(`${at(beat)}: step ${step ?? 'none'}: ${plain(shots[beat].card?.text ?? '')}`);
    if (step !== beat) failures.push(`${at(beat)}: the agent shows step ${step ?? 'none'}, want ${beat.toUpperCase()}`);
    if (!shots[beat].card?.text.trim()) failures.push(`${at(beat)}: the ${beat.toUpperCase()} step has no caption`);
  }
  if (new Set(STEPS.map((b) => plain(shots[b].card?.text ?? ''))).size !== STEPS.length) failures.push(`${scene}: two AI steps share a caption`);
  const early = ['before', ...STEPS.slice(0, STEPS.indexOf('sign')), 'unsigned'];
  for (const beat of early) if (signed(shots[beat].marks)) failures.push(`${at(beat)}: SIGNED shows before the sign beat`);
  if (plain(done.card?.text ?? '').includes(plain(AI[scene].audit))) failures.push(`${at('act')}: the audit line shows during the act`);
  if (plain(audit.card?.text ?? '') !== plain(AI[scene].audit)) failures.push(`${at('audit')}: the audit line reads "${plain(audit.card?.text ?? '')}"`);
  for (const text of act) {
    for (const beat of [...early, 'sign']) if (alpha(shots[beat].marks, text) > 0) failures.push(`${at(beat)}: ${text} acts before the person signs`);
    if (!(alpha(done.marks, text) > 0)) failures.push(`${at('act')}: ${text} never acts after SIGNED`);
  }
  console.log(`${scene}: card ${explain.card ? `${explain.card.lines} lines` : 'missing'}, SIGNED at ${BEAT.sign}, act ${act.map((a) => `${a}=${alpha(done.marks, a)}`).join(' ')}`);
  for (const shot of Object.values(shots)) await shot.context.close();
}

for (const scene of SCENES) {
  for (const { width, height = 900, deviceScaleFactor = 1, t } of LAYOUTS.flatMap((l) => [BEAT.explain, BEAT.act, BEAT.audit].map((t) => ({ ...l, t })))) {
    const shot = await stageAt(browser, base, scene, t, { viewport: { width, height }, deviceScaleFactor });
    const at = `${scene} card at ${width} t=${t}`;
    const { card, stage, marks, copy, zones } = shot;
    await shot.context.close();
    if (t === BEAT.act) {
      const where = `${scene} ${LAYER} at ${width}`;
      const layer = zones.find((z) => z.label === LAYER);
      const others = zones.filter((z) => z !== layer);
      const rings = marks.filter((m) => m.kind === 'ring');
      const agent = rings.find((m) => m.of === 'agent');
      if (!marks.some((m) => m.kind === 'zone' && m.text === LAYER)) failures.push(`${where}: no zone is labelled ${LAYER}`);
      if (!layer || !agent) failures.push(`${where}: ${layer ? 'no AGENT marker' : `no ${LAYER} zone area`}`);
      else {
        const spot = middle(agent.box);
        console.log(`${where}: AGENT at ${spot.map((v) => v.toFixed(0)).join(',')}, ${rings.filter((m) => inside(middle(m.box), layer.box)).length} markers inside the zone`);
        if (!inside(spot, layer.box)) failures.push(`${where}: the AGENT marker is outside the ${LAYER} zone`);
        for (const zone of others) if (inside(spot, zone.box)) failures.push(`${where}: the AGENT marker is inside the ${zone.label} zone`);
        for (const ring of rings) if (ring !== agent && inside(middle(ring.box), layer.box)) failures.push(`${where}: the ${ring.of} marker is inside the ${LAYER} zone`);
        for (const label of marks.filter((m) => m.kind === 'node' && m.of !== 'agent')) if (overlap(label.box, layer.box)) failures.push(`${where}: the ${label.text} label reaches into the ${LAYER} zone`);
      }
    }
    if (!card) {
      failures.push(`${at}: no agent card`);
      continue;
    }
    const { box } = card;
    const within = box.left >= stage.left - 0.5 && box.right <= stage.right + 0.5 && box.top >= stage.top - 0.5 && box.bottom <= stage.bottom + 0.5;
    const below = box.top >= stage.bottom - 0.5 && box.left >= 0 && box.right <= width;
    console.log(`${at}: ${card.lines} lines, ${within ? 'inside' : below ? 'below' : 'outside'} the stage`);
    if (!(within || (width < 820 && below))) failures.push(`${at}: the card is not inside the stage`);
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
