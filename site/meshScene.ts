import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PLANE, type Link, type Part, type Role, type Scene } from './scenes/types';

const BEATS = { markers: 2, models: 4, links: 7, fault: 10.5, recover: 13, resume: 16, fade: 18.2, loop: 19 };
const STILL = 17;
const TRAVEL = 1.4;
const PERIOD = 1.5;
const SEGMENTS = 48;
const RADIUS: Record<Role, number> = { source: 1.4, edge: 0.45, system: 0.8, output: 0.9 };
const OUTLINE: Record<Role, [number, number]> = { source: [56, 0], edge: [4, Math.PI / 4], system: [6, 0], output: [3, Math.PI / 2] };
const FLAT = -Math.PI / 2;
const HEADROOM = 2.4;
const MARGIN = 1.2;
const TEXT = { zone: 0.9, node: 0.8, tag: 0.9 };
const LEGIBLE = 24;
const GROWN = 1.8;
const STAGGER = 2.4;

type Step = (t: number, live: number) => void;
type Ink = { bone: THREE.Color; olive: THREE.Color; anisotropy: number };

const ramp = (t: number, start: number, length: number) => {
  const u = Math.min(1, Math.max(0, (t - start) / length));
  return u * u * (3 - 2 * u);
};

const faultAt = (order?: 1 | 2) => (order ? BEATS.fault + (order - 1) * 1.2 : Infinity);

function departures(link: Link, drawn: number): { due: number; leaves: number }[] {
  if (link.silent) return [];
  const fault = link.onFault ? faultAt(link.faulted ?? 1) : Infinity;
  const out: { due: number; leaves: number }[] = [];
  let held = 0;
  for (let due = drawn + 0.2; due < BEATS.loop; due += PERIOD) {
    const quiet = due > fault && (link.onFault === 'stop' || due < BEATS.resume);
    if (!quiet) out.push({ due, leaves: due });
    else if (link.onFault === 'hold') out.push({ due, leaves: BEATS.resume + held++ * 0.35 });
  }
  if (link.onFault === 'pause') out.push({ due: fault + 0.2, leaves: fault + 0.2 });
  return out;
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

function build(scene: Scene, { bone, olive, anisotropy }: Ink) {
  const group = new THREE.Group();
  const steps: Step[] = [];
  const words: THREE.Mesh[] = [];
  const names: THREE.Mesh[] = [];
  const rows: { row: THREE.Mesh; z: number }[] = [];

  const flat = (geometry: THREE.BufferGeometry, x: number, z: number) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: bone, transparent: true, depthWrite: false }));
    mesh.rotation.x = FLAT;
    mesh.position.set(x, 0.01, z);
    group.add(mesh);
    return mesh;
  };

  const text = (value: string, height: number, x: number, z: number) => {
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
    return mesh;
  };

  const stroke = (points: THREE.Vector3[], opacity: number, segments = false) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: bone, transparent: true, opacity, depthWrite: false });
    group.add(segments ? new THREE.LineSegments(geometry, material) : new THREE.Line(geometry, material));
    return material;
  };

  const [x0, z0, x1, z1] = PLANE;
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
  for (const zone of scene.zones) {
    const [a, b, c, d] = zone.rect;
    const edge = stroke([[a, b], [c, b], [c, d], [a, d], [a, b]].map(([x, z]) => new THREE.Vector3(x, 0, z)), 0);
    const row = text(zone.label, TEXT.zone, a + 0.4, d + TEXT.zone * 1.4);
    const name = row.material;
    rows.push({ row, z: row.position.z });
    steps.push((t, live) => {
      const shown = ramp(t, 0, 0.8) * live;
      edge.opacity = 0.28 * shown;
      name.opacity = 0.5 * shown;
    });
  }

  const modelled = scene.nodes.filter((n) => n.model).length;
  let landed = 0;
  scene.nodes.forEach((node, i) => {
    const [x, z] = node.at;
    const r = node.r ?? RADIUS[node.role];
    const [sides, spin] = OUTLINE[node.role];
    const born = BEATS.markers + (i / scene.nodes.length) * 2.2;
    const fault = faultAt(node.faulted);
    const ring = flat(new THREE.RingGeometry(r - (node.role === 'source' ? 0.06 : 0.09), r, sides, 1, spin), x, z);
    const fill = flat(new THREE.CircleGeometry(r, sides, spin), x, z);
    const dot = flat(new THREE.CircleGeometry(0.09, 12), x, z);
    const label = node.label ? text(node.label, TEXT.node, x - r * 0.7, z + r + TEXT.node * 1.1) : null;
    const alarm = node.faultTag ? text(node.faultTag, TEXT.tag, x - r * 0.7, z + r + TEXT.node * 1.1) : null;
    alarm?.material.color.copy(olive);
    if (label) names.push(label);
    steps.push((t, live) => {
      const grown = ramp(t, born + 0.3, 0.7);
      const hit = ramp(t, fault, 0.4);
      ring.scale.setScalar(Math.max(grown, 0.001));
      fill.scale.setScalar(Math.max(grown, 0.001));
      ring.material.opacity = grown * live;
      fill.material.opacity = grown * (0.05 + 0.12 * hit) * live;
      dot.material.opacity = ramp(t, born, 0.3) * live;
      for (const mark of [ring, fill, dot]) mark.material.color.lerpColors(bone, olive, hit);
      const raised = alarm ? ramp(t, fault + 0.3, 0.4) : 0;
      if (label) label.material.opacity = grown * 0.75 * (1 - raised) * live;
      if (alarm) alarm.material.opacity = raised * live;
    });

    if (!node.model) return;
    const lands = BEATS.models + (landed++ / modelled) * 2.3;
    const { solid, edges } = shape(node.model);
    const body = new THREE.Mesh(solid, new THREE.MeshLambertMaterial({ color: bone, transparent: true }));
    const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: bone, transparent: true }));
    const mirror = new THREE.Mesh(solid, new THREE.MeshBasicMaterial({ color: bone, transparent: true, side: THREE.BackSide, depthWrite: false }));
    mirror.scale.y = -1;
    body.renderOrder = lines.renderOrder = 1;
    group.add(mirror, body, lines);
    steps.push((t, live) => {
      const down = ramp(t, lands, 0.8);
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
  const flowing = scene.links.filter((l) => !l.reroute).length;
  const bead = new THREE.SphereGeometry(0.12, 10, 8);
  let flowed = 0;
  let rerouted = 0;
  for (const link of scene.links) {
    const [ax, az] = place.get(link.from)!;
    const [bx, bz] = place.get(link.to)!;
    const start = link.reroute ? BEATS.recover + rerouted++ * 0.8 : BEATS.links + (flowed++ / flowing) * 2.1;
    const length = link.reroute ? 1.4 : 0.8;
    const bend = link.bend ?? (link.silent ? 0 : 0.2);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(ax, 0.02, az),
      new THREE.Vector3((ax + bx) / 2 + (bz - az) * bend, 0.02, (az + bz) / 2 - (bx - ax) * bend),
      new THREE.Vector3(bx, 0.02, bz)
    );
    const path = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(SEGMENTS)),
      link.reroute
        ? new THREE.LineDashedMaterial({ color: bone, transparent: true, dashSize: 0.14, gapSize: 0.16, depthWrite: false })
        : new THREE.LineBasicMaterial({ color: bone, transparent: true, depthWrite: false })
    );
    path.computeLineDistances();
    group.add(path);
    const fault = faultAt(link.faulted);
    const ink = new THREE.MeshBasicMaterial({ color: bone, transparent: true });
    const beads = departures(link, start + length).map((d) => {
      const mesh = new THREE.Mesh(bead, ink);
      group.add(mesh);
      return { ...d, mesh };
    });
    const middle = curve.getPoint(0.5);
    const tag = link.tag ? text(link.tag, TEXT.tag, middle.x + 0.15, middle.z + TEXT.tag * 0.8) : null;
    const late = link.lateTag ? text(link.lateTag, TEXT.tag, middle.x + 0.15, middle.z + TEXT.tag * 0.8) : null;
    late?.material.color.copy(olive);
    const strength = link.reroute ? 0.95 : link.silent ? 0.75 : 0.4;
    steps.push((t, live) => {
      const drawn = ramp(t, start, length);
      const hit = ramp(t, fault, 0.4);
      const released = late ? ramp(t, BEATS.resume, 0.3) : 0;
      path.geometry.setDrawRange(0, drawn ? Math.round(drawn * SEGMENTS) + 1 : 0);
      path.material.color.lerpColors(bone, olive, hit);
      path.material.opacity = (strength + (1 - strength) * hit) * live;
      ink.color.lerpColors(bone, olive, hit);
      ink.opacity = live;
      if (tag) tag.material.opacity = ramp(t, start + length, 0.4) * (1 - released) * live;
      if (late) late.material.opacity = released * live;
      let queued = 0;
      for (const b of beads) {
        const u = (t - b.leaves) / TRAVEL;
        const waits = t >= b.due && t < b.leaves;
        b.mesh.visible = waits || (u >= 0 && u < 1);
        if (waits) b.mesh.position.copy(curve.getPoint(0.12)).setY(0.3 + queued++ * 0.32);
        else if (b.mesh.visible) b.mesh.position.copy(curve.getPoint(u)).setY(0.13);
      }
    });
  }

  const size = (grow: number) => {
    words.forEach((word) => word.scale.setScalar(grow));
    names.forEach((name) => (name.visible = grow === 1));
    rows.forEach(({ row, z }, i) => (row.position.z = z + (i % 2) * (grow - 1) * STAGGER));
  };

  return { group, size, update: (t: number) => steps.forEach((step) => step(t, 1 - ramp(t, BEATS.fade, 0.7))) };
}

export function mount(canvas: HTMLCanvasElement, caption: HTMLElement, scenes: Scene[]) {
  const context = canvas.getContext('webgl2', { antialias: true, alpha: true });
  if (!context) return () => {};
  const renderer = new THREE.WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const style = getComputedStyle(canvas);
  const ink: Ink = {
    bone: new THREE.Color(style.getPropertyValue('--bone').trim()),
    olive: new THREE.Color(style.getPropertyValue('--olive').trim()),
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

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 200);
  camera.position.set(50, 41, 50);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const [x0, z0, x1, z1] = PLANE;
  const bounds = new THREE.Box3();
  for (const x of [x0, x1]) for (const z of [z0, z1]) for (const y of [0, HEADROOM]) bounds.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
  bounds.expandByVector(new THREE.Vector3(MARGIN, MARGIN, 0));

  let elapsed = 0;
  let last = 0;
  let frame = 0;
  let seen = true;

  const draw = () => {
    const index = pinned === null ? Math.floor(elapsed / BEATS.loop) % list.length : 0;
    built.forEach((b, i) => (b.group.visible = i === index));
    built[index].update(pinned ?? elapsed % BEATS.loop);
    if (canvas.dataset.scene !== list[index].id) {
      canvas.dataset.scene = list[index].id;
      caption.textContent = list[index].caption;
    }
    renderer.render(world, camera);
    if (pinned !== null) canvas.dataset.t = String(pinned);
  };

  const fit = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const scale = Math.max((bounds.max.x - bounds.min.x) / width, (bounds.max.y - bounds.min.y) / height);
    camera.right = bounds.max.x;
    camera.left = bounds.max.x - width * scale;
    camera.bottom = bounds.min.y;
    camera.top = bounds.min.y + height * scale;
    camera.updateProjectionMatrix();
    built.forEach((b) => b.size(Math.min(GROWN, Math.max(1, LEGIBLE * scale))));
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
