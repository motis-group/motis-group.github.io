import * as THREE from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { grid, SIGNALS, STEPS, type Link, type Part, type Placement, type Role, type Scene, type Signal } from './scenes/types';

const BEATS = {
  markers: 2,
  models: 4,
  links: 7,
  agent: 9.4,
  normal: 10.5,
  fault: 22,
  detect: 23,
  correlate: 25.5,
  trace: 28,
  explain: 30.5,
  recommend: 33,
  sign: 34.5,
  act: 36,
  audit: 39.5,
  fade: 43.6,
  loop: 45,
};
const STILL = 41;
const TRACED = 1.6;
const TYPED = 0.8;
const TRAVEL = 2.8;
const PERIOD: Record<Signal, number> = { telemetry: 1.6, event: 3.2, record: 4.8, agent: 3.2 };
const HELD = 3;
const CHIPS = 4;
const CHIP = { gap: 6, pad: 3, fade: 0.05, least: 0.16 };
const CORNERS: [number, number][] = [[1, -1], [-1, -1], [1, 1], [-1, 1]];
const SEGMENTS = 48;
const RADIUS: Record<Role, number> = { source: 1.4, edge: 0.45, system: 0.8, output: 0.9, agent: 0.7 };
const OUTLINE: Record<Role, [number, number]> = { source: [56, 0], edge: [4, Math.PI / 4], system: [6, 0], output: [3, Math.PI / 2], agent: [4, 0] };
const FLAT = -Math.PI / 2;
const HEADROOM = 2.4;
const MARGIN = 1.2;
const TEXT = { zone: 0.9, node: 0.8, tag: 0.9 };
const LEGIBLE = 24;
const GROWN = 1.5;
const STAGGER = 1.05;
const GAP = 0.25;
const CREASE = 30;
const MODELS = '/models/';

type Step = (t: number, live: number) => void;
type Ink = { bone: THREE.Color; olive: THREE.Color; signal: Record<Signal, THREE.Color>; anisotropy: number };
type Rider = { text: string; signal: Signal; curve: THREE.QuadraticBezierCurve3; leaves: number[] };
type Shape = [number, number][];
type Mark = { of: string; kind: 'zone' | 'node' | 'tag' | 'ring'; text?: string; mesh: THREE.Mesh; shape: [number, number][] };
type Loaded = { id: string; urls: string[]; ok: boolean };

const ramp = (t: number, start: number, length: number) => {
  const u = Math.min(1, Math.max(0, (t - start) / length));
  return u * u * (3 - 2 * u);
};

const faultAt = (order?: 1 | 2) => (order ? BEATS.fault + (order - 1) * 1.2 : Infinity);

const signalOf = (link: Link): Signal => (link.beat ? 'agent' : (link.signal ?? 'telemetry'));

const overlaps = (a: Shape, b: Shape) =>
  [a, b].every((shape) =>
    shape.every(([x, y], i) => {
      const [u, v] = shape[(i + 1) % shape.length];
      const along = (points: Shape) => points.map(([px, py]) => px * (y - v) + py * (u - x));
      const [p, q] = [along(a), along(b)];
      return Math.max(...p) > Math.min(...q) && Math.max(...q) > Math.min(...p);
    })
  );

const rect = (x: number, y: number, w: number, h: number, pad = 0): Shape => [
  [x - pad, y - pad],
  [x + w + pad, y - pad],
  [x + w + pad, y + h + pad],
  [x - pad, y + h + pad],
];

function departures(link: Link, drawn: number): { due: number; leaves: number }[] {
  if (link.silent || link.beat === 'sign') return [];
  const fault = link.onFault ? faultAt(link.faulted ?? 1) : Infinity;
  const out: { due: number; leaves: number }[] = [];
  let held = 0;
  for (let due = drawn + 0.2; due < BEATS.loop; due += PERIOD[signalOf(link)]) {
    const quiet = due > fault && (link.onFault === 'stop' || due < BEATS.act);
    if (!quiet) out.push({ due, leaves: due });
    else if (link.onFault === 'hold' && held < HELD) out.push({ due, leaves: BEATS.act + held++ * 0.35 });
  }
  if (link.onFault === 'pause') out.push({ due: fault + 0.2, leaves: fault + 0.2 });
  return out;
}

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const files = new Map<string, Promise<THREE.BufferGeometry>>();

function file(url: string) {
  if (!files.has(url))
    files.set(
      url,
      loader.loadAsync(url).then(({ scene }) => {
        scene.updateMatrixWorld(true);
        const pieces: THREE.BufferGeometry[] = [];
        scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const source = mesh.geometry.getAttribute('position');
          const points = new Float32Array(source.count * 3).map((_, i) => source.getComponent(Math.floor(i / 3), i % 3));
          const piece = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(points, 3));
          if (mesh.geometry.index) piece.setIndex(mesh.geometry.index.clone());
          pieces.push(piece.applyMatrix4(mesh.matrixWorld).toNonIndexed());
        });
        return mergeGeometries(pieces);
      })
    );
  return files.get(url)!;
}

async function sourced(placements: Placement[]) {
  const placed = await Promise.all(
    placements.map(async ({ src, size, at = [0, 0, 0], turn = [0, 0, 0] }) => {
      const g = (await file(MODELS + src + '.glb')).clone().applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...turn)));
      g.computeBoundingBox();
      const { min, max } = g.boundingBox!;
      const scale = size / Math.max(max.x - min.x, max.y - min.y, max.z - min.z);
      return g.translate(-(min.x + max.x) / 2, -min.y, -(min.z + max.z) / 2).scale(scale, scale, scale).translate(...at);
    })
  );
  const solid = mergeGeometries(placed);
  solid.computeVertexNormals();
  return { solid, edges: new THREE.EdgesGeometry(solid, CREASE) };
}

function shape(parts: Part[]) {
  const solids = parts.map((p) => {
    const g = p.shape === 'box' ? new THREE.BoxGeometry(...p.size) : new THREE.CylinderGeometry(p.size[0], p.size[1], p.size[2], p.sides ?? 10);
    if (p.turn) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...p.turn)));
    return g.translate(...p.at);
  });
  const edges = solids.map((g) => new THREE.EdgesGeometry(g, 20));
  const merged = { solid: mergeGeometries(solids), edges: mergeGeometries(edges) };
  [...solids, ...edges].forEach((g) => g.dispose());
  return merged;
}

function build(scene: Scene, { bone, olive, signal, anisotropy }: Ink) {
  const group = new THREE.Group();
  const loads: Promise<Loaded>[] = [];
  const steps: Step[] = [];
  const words: THREE.Mesh[] = [];
  const marks: Mark[] = [];
  const names: { name: THREE.Mesh; top: number; height: number; below?: number }[] = [];
  const riders: Rider[] = [];
  const teal = signal.agent;
  const rows: { row: THREE.Mesh; z: number }[] = [];

  const flat = (geometry: THREE.BufferGeometry, x: number, z: number) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: bone, transparent: true, depthWrite: false }));
    mesh.rotation.x = FLAT;
    mesh.position.set(x, 0.01, z);
    group.add(mesh);
    return mesh;
  };

  const text = (value: string, height: number, x: number, z: number, kind: Mark['kind'], of: string) => {
    const canvas = document.createElement('canvas');
    const pen = canvas.getContext('2d')!;
    const font = '500 44px "Berkeley Mono", ui-monospace, monospace';
    pen.font = font;
    canvas.width = Math.ceil(pen.measureText(value).width) + 8;
    canvas.height = 64;
    pen.font = font;
    pen.fillStyle = '#fff';
    pen.textBaseline = 'middle';
    pen.fillText(value, 4, 34);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = anisotropy;
    const width = (height * canvas.width) / canvas.height;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height).translate(width / 2, 0, 0),
      new THREE.MeshBasicMaterial({ map, color: bone, transparent: true, depthWrite: false })
    );
    mesh.rotation.x = FLAT;
    mesh.position.set(x, 0.03, z);
    group.add(mesh);
    words.push(mesh);
    marks.push({ of, kind, text: value, mesh, shape: [[0, -height / 2], [width, -height / 2], [width, height / 2], [0, height / 2]] });
    return mesh;
  };

  const stroke = (points: THREE.Vector3[], opacity: number, segments = false) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: bone, transparent: true, opacity, depthWrite: false });
    group.add(segments ? new THREE.LineSegments(geometry, material) : new THREE.Line(geometry, material));
    return material;
  };

  const [x0, z0, x1, z1] = grid(scene);
  const ruled: THREE.Vector3[] = [];
  const dots: THREE.Vector3[] = [];
  for (let x = x0; x <= x1; x++) {
    ruled.push(new THREE.Vector3(x, 0, z0), new THREE.Vector3(x, 0, z1));
    for (let z = z0; z <= z1; z++) dots.push(new THREE.Vector3(x, 0, z));
  }
  for (let z = z0; z <= z1; z++) ruled.push(new THREE.Vector3(x0, 0, z), new THREE.Vector3(x1, 0, z));
  stroke(ruled, 0.05, true);
  group.add(
    new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(dots),
      new THREE.PointsMaterial({ color: bone, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.3, depthWrite: false })
    )
  );
  scene.zones.forEach((zone, i) => {
    const [a, b, c, d] = zone.rect;
    const edge = stroke([[a, b], [c, b], [c, d], [a, d], [a, b]].map(([x, z]) => new THREE.Vector3(x, 0, z)), 0);
    const row = text(zone.label, TEXT.zone, a + 0.4, d + TEXT.zone * 1.4, 'zone', `zone ${i}`);
    const name = row.material;
    rows.push({ row, z: row.position.z });
    steps.push((t, live) => {
      const shown = ramp(t, 0, 0.8) * live;
      edge.opacity = 0.28 * shown;
      name.opacity = 0.5 * shown;
    });
  });

  const modelled = scene.nodes.filter((n) => n.model).length;
  let landed = 0;
  scene.nodes.forEach((node, i) => {
    const [x, z] = node.at;
    const r = node.r ?? RADIUS[node.role];
    const [sides, spin] = OUTLINE[node.role];
    const born = node.id === scene.agent?.signer ? BEATS.recommend : node.role === 'agent' ? BEATS.agent - 0.3 : BEATS.markers + (i / scene.nodes.length) * 2.2;
    const tone = node.role === 'agent' ? teal : bone;
    const fault = faultAt(node.faulted);
    const ring = flat(new THREE.RingGeometry(r - (node.role === 'source' ? 0.06 : 0.09), r, sides, 1, spin), x, z);
    const fill = flat(new THREE.CircleGeometry(r, sides, spin), x, z);
    const dot = flat(new THREE.CircleGeometry(0.09, 12), x, z);
    const inner = node.role === 'agent' ? [flat(new THREE.RingGeometry(r * 0.55 - 0.07, r * 0.55, sides, 1, spin), x, z)] : [];
    marks.push({ of: node.id, kind: 'ring', mesh: fill, shape: Array.from({ length: sides }, (_, k) => [r * Math.cos(spin + (k * 2 * Math.PI) / sides), r * Math.sin(spin + (k * 2 * Math.PI) / sides)]) });
    const label = node.label ? text(node.label, TEXT.node, x - r * 0.7, z, 'node', node.id) : null;
    const alarm = node.faultTag ? text(node.faultTag, TEXT.tag, x - r * 0.7, z, 'node', node.id) : null;
    const signed = node.id === scene.agent?.signer ? text('SIGNED', TEXT.tag, x - r * 0.7, z, 'tag', node.id) : null;
    alarm?.material.color.copy(olive);
    label?.material.color.copy(tone);
    if (label) names.push({ name: label, top: z + r + GAP, height: TEXT.node });
    if (alarm) names.push({ name: alarm, top: z + r + GAP, height: TEXT.tag });
    if (signed) names.push({ name: signed, top: z + r + GAP, height: TEXT.tag, below: TEXT.node });
    steps.push((t, live) => {
      const grown = ramp(t, born + 0.3, 0.7);
      const hit = ramp(t, fault, 0.4);
      for (const mark of [ring, fill, ...inner]) mark.scale.setScalar(Math.max(grown, 0.001));
      for (const mark of [ring, ...inner]) mark.material.opacity = grown * live;
      fill.material.opacity = grown * (0.05 + 0.12 * hit) * live;
      dot.material.opacity = ramp(t, born, 0.3) * live;
      const closed = node.role === 'output' ? ramp(t, BEATS.act + 1.5, 0.4) * (1 - ramp(t, BEATS.audit + 1, 1)) : 0;
      for (const mark of [ring, fill, dot, ...inner]) mark.material.color.lerpColors(tone, olive, hit).lerp(teal, closed);
      const raised = alarm ? ramp(t, fault + 0.3, 0.4) : 0;
      if (label) label.material.opacity = grown * 0.75 * (1 - raised) * live;
      if (alarm) alarm.material.opacity = raised * live;
      if (signed) {
        signed.visible = t >= BEATS.sign;
        signed.material.opacity = ramp(t, BEATS.sign, 0.3) * live;
      }
    });

    if (!node.model) return;
    const lands = Math.max(born, BEATS.models + (landed++ / modelled) * 2.3);
    const body = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshLambertMaterial({ color: bone, transparent: true }));
    const lines = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: bone, transparent: true }));
    const mirror = new THREE.Mesh(body.geometry, new THREE.MeshBasicMaterial({ color: bone, transparent: true, side: THREE.BackSide, depthWrite: false }));
    mirror.scale.y = -1;
    body.renderOrder = lines.renderOrder = 1;
    group.add(mirror, body, lines);
    const wear = ({ solid, edges }: { solid: THREE.BufferGeometry; edges: THREE.BufferGeometry }) => {
      body.geometry.dispose();
      lines.geometry.dispose();
      body.geometry = mirror.geometry = solid;
      lines.geometry = edges;
    };
    const parts = node.model;
    const urls = (node.glb ?? []).map((p) => MODELS + p.src + '.glb');
    if (node.glb)
      loads.push(
        sourced(node.glb).then(
          (model) => (wear(model), { id: node.id, urls, ok: true }),
          () => (wear(shape(parts)), { id: node.id, urls, ok: false })
        )
      );
    else wear(shape(parts));
    steps.push((t, live) => {
      const down = ramp(t, lands, 0.8);
      const hit = ramp(t, fault, 0.4);
      for (const mark of [body, lines, mirror]) mark.material.color.lerpColors(bone, olive, hit);
      const lift = (1 - down) * 2.4;
      body.position.set(x, lift, z);
      lines.position.set(x, lift, z);
      mirror.position.set(x, -lift, z);
      body.material.opacity = 0.6 * down * live;
      lines.material.opacity = 0.55 * down * live;
      mirror.material.opacity = 0.09 * down * live;
    });
  });

  const place = new Map(scene.nodes.map((n) => [n.id, n.at]));
  const flowing = scene.links.filter((l) => !l.reroute && !l.beat).length;
  const trail = scene.agent?.trace ?? [];
  const stride = TRACED / Math.max(1, trail.length - 1);
  const traced: THREE.Vector3[] = [];
  const bead = new THREE.SphereGeometry(0.12, 10, 8);
  let flowed = 0;
  let rerouted = 0;
  scene.links.forEach((link) => {
    const [ax, az] = place.get(link.from)!;
    const [bx, bz] = place.get(link.to)!;
    const start =
      link.beat === 'detect' ? BEATS.agent + 0.2 : link.beat === 'sign' ? BEATS.sign - 0.5 : link.reroute ? BEATS.act + rerouted++ * 0.6 : BEATS.links + (flowed++ / flowing) * 2.1;
    const tone = link.silent ? bone : signal[signalOf(link)];
    const length = link.beat ? 0.5 : link.reroute ? 1.4 : 0.8;
    const bend = link.bend ?? (link.silent || link.beat ? 0 : 0.2);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(ax, 0.02, az),
      new THREE.Vector3((ax + bx) / 2 + (bz - az) * bend, 0.02, (az + bz) / 2 - (bx - ax) * bend),
      new THREE.Vector3(bx, 0.02, bz)
    );
    const path = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(SEGMENTS)),
      link.reroute
        ? new THREE.LineDashedMaterial({ color: tone, transparent: true, dashSize: 0.14, gapSize: 0.16, depthWrite: false })
        : new THREE.LineBasicMaterial({ color: tone, transparent: true, depthWrite: false })
    );
    path.computeLineDistances();
    group.add(path);
    const hop = trail.findIndex((id, k) => k > 0 && [trail[k - 1], id].sort().join() === [link.from, link.to].sort().join());
    const forward = hop > 0 && trail[hop - 1] === link.from;
    const begins = BEATS.trace + (hop - 1) * stride;
    const pulse = hop > 0 ? new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), new THREE.MeshBasicMaterial({ color: teal, transparent: true })) : null;
    if (pulse) {
      group.add(pulse);
      traced.push(...curve.getPoints(12).slice(2, -2));
    }
    const fault = faultAt(link.faulted);
    const ink = new THREE.MeshBasicMaterial({ color: tone, transparent: true });
    const beads = departures(link, start + length).map((d) => {
      const mesh = new THREE.Mesh(bead, ink);
      group.add(mesh);
      return { ...d, mesh };
    });
    if (link.chip)
      riders.push({
        text: link.chip,
        signal: signalOf(link),
        curve,
        leaves: beads.map((b) => b.leaves).filter((leaves) => leaves >= BEATS.normal && leaves + TRAVEL <= BEATS.fault),
      });
    const middle = curve.getPoint(link.tagAt ?? 0.5);
    const of = `${link.from}>${link.to}`;
    const tag = link.tag ? text(link.tag, TEXT.tag, middle.x + 0.15, middle.z + TEXT.tag * 0.8, 'tag', of) : null;
    const late = link.lateTag ? text(link.lateTag, TEXT.tag, middle.x + 0.15, middle.z + TEXT.tag * 0.8, 'tag', of) : null;
    const alarm = link.faultTag ? text(link.faultTag, TEXT.tag, middle.x + 0.15, middle.z + TEXT.tag * 0.8, 'tag', of) : null;
    const raised = faultAt(link.faulted ?? 1) + 0.2;
    tag?.material.color.copy(tone);
    late?.material.color.copy(olive);
    alarm?.material.color.copy(olive);
    const reads = link.beat === 'detect';
    const strength = link.reroute ? 0.95 : link.silent ? 0.75 : reads ? 0.3 : 0.5;
    const crossed = reads && !!scene.agent?.correlate.includes(link.to);
    steps.push((t, live) => {
      const drawn = ramp(t, start, length);
      const hit = ramp(t, fault, 0.4);
      const released = late ? ramp(t, BEATS.act, 0.3) : 0;
      path.geometry.setDrawRange(0, drawn ? Math.round(drawn * SEGMENTS) + 1 : 0);
      const glow = hop > 0 ? ramp(t, begins, stride) * (1 - ramp(t, BEATS.act, 0.6)) : 0;
      path.material.color.lerpColors(tone, olive, hit);
      const flagged = ramp(t, BEATS.detect, 0.4) * (1 - ramp(t, BEATS.correlate, 0.4));
      const matched = crossed ? ramp(t, BEATS.correlate, 0.4) * (1 - ramp(t, BEATS.explain, 0.8)) : 0;
      const lit = hop > 0 ? glow : reads ? 0.3 + 0.7 * Math.max(flagged, matched) : 0;
      path.material.opacity = Math.max(strength + (1 - strength) * hit, lit) * live;
      if (pulse) {
        const u = (t - begins) / stride;
        pulse.visible = u >= 0 && u < 1;
        pulse.position.copy(curve.getPoint(Math.min(1, Math.max(0, forward ? u : 1 - u)))).setY(0.2);
        pulse.material.opacity = live;
      }
      ink.color.lerpColors(tone, olive, hit);
      ink.opacity = live;
      const alarmed = alarm ? ramp(t, raised, 0.3) * (1 - ramp(t, BEATS.act, 0.3)) : 0;
      if (tag) tag.material.opacity = ramp(t, start + length, 0.4) * (1 - released) * (1 - alarmed) * live;
      if (late) late.material.opacity = released * live;
      if (alarm) {
        alarm.material.opacity = alarmed * live;
        alarm.visible = alarmed > 0;
      }
      let queued = 0;
      for (const b of beads) {
        const u = (t - b.leaves) / TRAVEL;
        const waits = t >= b.due && t < b.leaves;
        b.mesh.visible = waits || (u >= 0 && u < 1);
        if (waits) b.mesh.position.copy(curve.getPoint(0.12)).setY(0.3 + queued++ * 0.32);
        else if (b.mesh.visible) b.mesh.position.copy(curve.getPoint(reads ? 1 - u : u)).setY(0.13);
      }
    });
  });

  const size = (grow: number) => {
    words.forEach((word) => word.scale.setScalar(grow));
    names.forEach(({ name, top, height, below = 0 }) => (name.position.z = top + (below + height / 2) * grow));
    rows.forEach(({ row, z }, i) => (row.position.z = z + (grow > 1 ? (i % 2) * grow * STAGGER : 0)));
  };

  const agent = scene.agent;
  const captions = STEPS.map((step) => (!agent ? '' : step === 'explain' ? agent.card.join('\n') : agent.say[step]));
  const say = (t: number) => {
    const step = agent ? STEPS.reduce((at, beat, k) => (t >= BEATS[beat] ? k : at), -1) : -1;
    if (step < 0) return { step, text: '' };
    const text = captions[step];
    return { step, text: text.slice(0, Math.round(Math.min(1, (t - BEATS[STEPS[step]]) / TYPED) * text.length)) };
  };

  return { group, marks, size, loads, traced, riders, say, update: (t: number) => steps.forEach((step) => step(t, 1 - ramp(t, BEATS.fade, 0.7))) };
}

export function mount(canvas: HTMLCanvasElement, caption: HTMLElement, card: HTMLElement, chips: HTMLElement, scenes: Scene[]) {
  const context = canvas.getContext('webgl2', { antialias: true, alpha: true });
  if (!context) return () => {};
  const renderer = new THREE.WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const style = getComputedStyle(canvas);
  const ink: Ink = {
    bone: new THREE.Color(style.getPropertyValue('--bone').trim()),
    olive: new THREE.Color(style.getPropertyValue('--olive').trim()),
    signal: Object.fromEntries(SIGNALS.map(({ id, ink }) => [id, new THREE.Color(style.getPropertyValue(ink).trim())])) as Record<Signal, THREE.Color>,
    anisotropy: renderer.capabilities.getMaxAnisotropy(),
  };

  const query = new URLSearchParams(window.location.search);
  const chosen = scenes.filter((s) => s.id === query.get('scene'));
  const list = chosen.length ? chosen : scenes;
  const pinned = query.has('t') ? Number(query.get('t')) : window.matchMedia('(prefers-reduced-motion: reduce)').matches ? STILL : null;

  const world = new THREE.Scene();
  world.add(new THREE.AmbientLight(ink.bone, 1.4));
  const sun = new THREE.DirectionalLight(ink.bone, 2.2);
  sun.position.set(-4, 9, 6);
  world.add(sun);
  const built = list.map((scene) => build(scene, ink));
  built.forEach((b) => world.add(b.group));
  let stopped = false;
  Promise.all(built.flatMap((b) => b.loads)).then((loaded) => {
    if (stopped) return;
    canvas.dataset.models = JSON.stringify({
      nodes: Object.fromEntries(loaded.map(({ id, urls }) => [id, urls])),
      fallback: loaded.filter((l) => !l.ok).map((l) => l.id),
    });
    if (pinned !== null) draw();
  });

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 200);
  const bounds = new THREE.Box3();
  let aimed = 0;
  const aim = (aspect: number) => {
    const [x0, z0, x1, z1] = grid(list[aimed]);
    const reach = (x1 - x0 + z1 - z0) / Math.SQRT2;
    const rise = Math.asin(Math.min(1, ((reach + 2 * MARGIN) / aspect - 2 * MARGIN) / Math.hypot(reach, HEADROOM))) - Math.atan2(HEADROOM, reach);
    camera.position.set(50, 50 * Math.SQRT2 * Math.tan(rise), 50);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    bounds.makeEmpty();
    for (const x of [x0, x1]) for (const z of [z0, z1]) for (const y of [0, HEADROOM]) bounds.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
    bounds.expandByVector(new THREE.Vector3(MARGIN, MARGIN, 0));
  };

  const steps = [...card.querySelectorAll('li')];
  const voice = card.querySelector('.mesh-say')!;
  let windows: { span: [number, number]; corner: [number, number] }[] = [];

  const screen = (point: THREE.Vector3) => {
    const p = point.clone().project(camera);
    return [((p.x + 1) * canvas.clientWidth) / 2, ((1 - p.y) * canvas.clientHeight) / 2].map((v) => Math.round(v * 10) / 10) as [number, number];
  };
  const place = (mesh: THREE.Mesh, [x, y]: [number, number]) => screen(mesh.localToWorld(new THREE.Vector3(x, y, 0)));
  const chipAt = (point: THREE.Vector3, chip: HTMLElement, [sx, sy]: [number, number]) => {
    const [x, y] = screen(point);
    return [sx > 0 ? x + CHIP.gap : x - CHIP.gap - chip.offsetWidth, sy > 0 ? y + CHIP.gap : y - CHIP.gap - chip.offsetHeight] as [number, number];
  };

  const ride = () => {
    const riders = built[aimed].riders;
    if (chips.dataset.scene !== list[aimed].id) {
      chips.dataset.scene = list[aimed].id;
      chips.replaceChildren(
        ...riders.map(({ text, signal }) => {
          const chip = document.createElement('span');
          chip.className = 'mesh-chip';
          chip.textContent = text;
          chip.style.setProperty('--c', `var(${SIGNALS.find((s) => s.id === signal)!.ink})`);
          return chip;
        })
      );
    }
    chips.style.left = `${canvas.offsetLeft}px`;
    chips.style.top = `${canvas.offsetTop}px`;
    built[aimed].group.updateMatrixWorld(true);
    const blocks = built[aimed].marks.map(({ mesh, shape }) => shape.map((point) => place(mesh, point)));
    windows = riders.map((rider, i) => {
      const chip = chips.children[i] as HTMLElement;
      let best = { span: [0, 0] as [number, number], corner: CORNERS[0] };
      for (const corner of CORNERS) {
        let run: [number, number] | null = null;
        for (let u = 0.04; u <= 0.96; u += 0.02) {
          const [x, y] = chipAt(rider.curve.getPoint(u), chip, corner);
          const box = rect(x, y, chip.offsetWidth, chip.offsetHeight, CHIP.pad);
          const clear = x >= 0 && y >= 0 && x + chip.offsetWidth <= canvas.clientWidth && y + chip.offsetHeight <= canvas.clientHeight && !blocks.some((b) => overlaps(box, b));
          run = clear ? [run ? run[0] : u, u] : null;
          if (run && run[1] - run[0] > best.span[1] - best.span[0]) best = { span: [run[0], run[1]], corner };
        }
      }
      return best;
    });
  };

  const carry = (t: number, live: number) => {
    const placed: Shape[] = [];
    built[aimed].riders.forEach((rider, i) => {
      const chip = chips.children[i] as HTMLElement | undefined;
      if (!chip) return;
      const { span, corner } = windows[i];
      let shown = 0;
      for (const leaves of span[1] - span[0] >= CHIP.least ? rider.leaves : []) {
        const u = (t - leaves) / TRAVEL;
        if (u < span[0] || u > span[1]) continue;
        const [x, y] = chipAt(rider.curve.getPoint(u), chip, corner);
        const box = rect(x, y, chip.offsetWidth, chip.offsetHeight, CHIP.pad);
        if (placed.length >= CHIPS || placed.some((other) => overlaps(box, other))) break;
        placed.push(box);
        shown = Math.min(1, (u - span[0]) / CHIP.fade, (span[1] - u) / CHIP.fade) * live;
        chip.style.transform = `translate(${x}px, ${y}px)`;
        break;
      }
      chip.style.opacity = String(shown);
      chip.style.visibility = shown > 0 ? 'visible' : 'hidden';
    });
  };

  let elapsed = 0;
  let last = 0;
  let frame = 0;
  let seen = true;

  const draw = () => {
    const index = pinned === null ? Math.floor(elapsed / BEATS.loop) % list.length : 0;
    if (index !== aimed) {
      aimed = index;
      focus();
    }
    built.forEach((b, i) => (b.group.visible = i === index));
    const t = pinned ?? elapsed % BEATS.loop;
    built[index].update(t);
    const live = 1 - ramp(t, BEATS.fade, 0.7);
    const { step, text } = built[index].say(t);
    card.style.visibility = step < 0 ? 'hidden' : 'visible';
    steps.forEach((item, k) => (item.className = k === step ? 'on' : k < step ? 'done' : ''));
    if (voice.textContent !== text) voice.textContent = text;
    card.style.opacity = String(live);
    carry(t, live);
    if (canvas.dataset.scene !== list[index].id) {
      canvas.dataset.scene = list[index].id;
      caption.textContent = list[index].caption;
    }
    renderer.render(world, camera);
    if (pinned === null) return;
    canvas.dataset.layout = JSON.stringify(
      built[index].marks
        .filter((m) => m.mesh.visible)
        .map(({ mesh, shape, ...mark }) => ({ ...mark, alpha: Math.round((mesh.material as THREE.Material).opacity * 100) / 100, box: shape.map((point) => place(mesh, point)) }))
    );
    canvas.dataset.trace = JSON.stringify(built[index].traced.map(screen));
    canvas.dataset.zones = JSON.stringify(
      list[index].zones.map(({ label, rect: [a, b, c, d] }) => ({ label, box: [[a, b], [c, b], [c, d], [a, d]].map(([x, z]) => screen(new THREE.Vector3(x, 0, z))) }))
    );
    canvas.dataset.t = String(pinned);
  };

  const focus = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    aim(width / height);
    const scale = Math.max((bounds.max.x - bounds.min.x) / width, (bounds.max.y - bounds.min.y) / height);
    camera.right = bounds.max.x;
    camera.left = bounds.max.x - width * scale;
    camera.bottom = bounds.min.y;
    camera.top = bounds.min.y + height * scale;
    camera.updateProjectionMatrix();
    built.forEach((b) => b.size(Math.min(GROWN, Math.max(1, LEGIBLE * scale))));
    ride();
  };

  const fit = () => {
    focus();
    draw();
  };

  const tick = (now: number) => {
    elapsed += Math.min(Math.max(now - last, 0), 100) / 1000;
    last = now;
    draw();
    frame = requestAnimationFrame(tick);
  };

  const run = () => {
    cancelAnimationFrame(frame);
    if (pinned !== null || !seen || document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const sized = new ResizeObserver(fit);
  sized.observe(canvas);
  const watched = new IntersectionObserver(([entry]) => {
    seen = entry.isIntersecting;
    run();
  });
  watched.observe(canvas);
  document.addEventListener('visibilitychange', run);
  fit();
  run();

  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    sized.disconnect();
    watched.disconnect();
    document.removeEventListener('visibilitychange', run);
    world.traverse((object) => {
      const item = object as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
      item.geometry?.dispose();
      for (const material of [item.material ?? []].flat()) {
        (material as THREE.MeshBasicMaterial).map?.dispose();
        material.dispose();
      }
    });
    renderer.dispose();
  };
}
