import type { Part, Placement, Scene } from './types';

const AXLE: [number, number, number] = [Math.PI / 2, 0, 0];

const wheels = (xs: number[], z: number, r: number): Part[] =>
  xs.flatMap((x) => [-z, z].map((side): Part => ({ shape: 'cyl', size: [r, r, 0.24], at: [x, r, side], turn: AXLE })));

const loader: Part[] = [
  { shape: 'box', size: [1.5, 0.5, 0.9], at: [-0.55, 0.62, 0] },
  { shape: 'box', size: [0.55, 0.42, 0.5], at: [-0.25, 1.05, -0.2] },
  { shape: 'box', size: [0.9, 0.16, 0.3], at: [0.6, 0.55, 0] },
  { shape: 'cyl', size: [0.48, 0.48, 1.2], at: [1.3, 0.42, 0], turn: [-Math.PI / 2, 0, 0], sides: 3 },
  ...wheels([-0.95, 0.1], 0.52, 0.36),
];

const crusher: Part[] = [
  { shape: 'cyl', size: [0.95, 0.42, 0.8], at: [-1.05, 1.55, 0], sides: 4, turn: [0, Math.PI / 4, 0] },
  { shape: 'box', size: [0.85, 1.15, 0.85], at: [-1.05, 0.58, 0] },
  { shape: 'box', size: [2.7, 0.1, 0.5], at: [0.55, 0.8, 0], turn: [0, 0, 0.24] },
  { shape: 'box', size: [0.08, 0.5, 0.42], at: [-0.2, 0.25, 0] },
  { shape: 'box', size: [0.08, 1.05, 0.42], at: [1.6, 0.52, 0] },
  { shape: 'box', size: [0.34, 0.3, 0.7], at: [0.7, 0.9, 0], turn: [0, 0, 0.24] },
  { shape: 'cyl', size: [0, 0.5, 0.5], at: [2.1, 0.25, 0], sides: 7 },
];

const mill: Part[] = [
  { shape: 'cyl', size: [0.62, 0.62, 1.3], at: [-0.55, 0.85, -0.45], turn: [0, 0, Math.PI / 2], sides: 12 },
  { shape: 'cyl', size: [0.3, 0.62, 0.25], at: [0.22, 0.85, -0.45], turn: [0, 0, -Math.PI / 2], sides: 12 },
  { shape: 'box', size: [0.2, 0.5, 0.9], at: [-1.1, 0.25, -0.45] },
  { shape: 'box', size: [0.2, 0.5, 0.9], at: [0, 0.25, -0.45] },
  { shape: 'cyl', size: [0.42, 0.42, 0.7], at: [0.85, 0.35, 0.35] },
  { shape: 'cyl', size: [0.42, 0.42, 0.7], at: [-0.1, 0.35, 0.75] },
  { shape: 'cyl', size: [0.42, 0.42, 0.7], at: [-1.05, 0.35, 0.75] },
];

const bench: Part[] = [
  { shape: 'box', size: [1.3, 0.08, 0.6], at: [0, 0.7, 0] },
  { shape: 'box', size: [0.08, 0.66, 0.6], at: [-0.58, 0.33, 0] },
  { shape: 'box', size: [0.08, 0.66, 0.6], at: [0.58, 0.33, 0] },
  { shape: 'cyl', size: [0.05, 0.16, 0.32], at: [-0.32, 0.9, 0], sides: 8 },
  { shape: 'cyl', size: [0.1, 0.1, 0.2], at: [0, 0.84, 0.1], sides: 8 },
  { shape: 'box', size: [0.34, 0.3, 0.34], at: [0.35, 0.89, -0.05] },
];

const stockpile: Part[] = [
  { shape: 'cyl', size: [0, 1.15, 0.95], at: [-0.3, 0.475, -0.1], sides: 7 },
  { shape: 'cyl', size: [0, 0.3, 0.9], at: [1.1, 0.45, 0.6], sides: 3 },
  { shape: 'cyl', size: [0.025, 0.025, 0.5], at: [1.1, 1.1, 0.6], sides: 6 },
  { shape: 'box', size: [0.22, 0.22, 0.05], at: [1.1, 1.42, 0.6] },
];

export const operator: Part[] = [
  { shape: 'box', size: [0.3, 0.7, 0.2], at: [0, 0.35, 0] },
  { shape: 'box', size: [0.42, 0.58, 0.24], at: [0, 0.99, 0] },
  { shape: 'box', size: [0.2, 0.22, 0.2], at: [0, 1.41, 0] },
  { shape: 'cyl', size: [0.13, 0.17, 0.09], at: [0, 1.56, 0], sides: 8 },
  { shape: 'box', size: [0.3, 0.1, 0.1], at: [0.28, 1.02, 0.1] },
  { shape: 'box', size: [0.26, 0.34, 0.03], at: [0.42, 1.1, 0.1], turn: [0, 0, -0.6] },
];

const loaderModel: Placement[] = [{ src: 'haul-truck', size: 2.9, turn: [0, -Math.PI / 2, 0] }];

const crusherModel: Placement[] = [
  { src: 'crusher-hopper', size: 1.7, at: [-1.05, 0, 0] },
  { src: 'conveyor', size: 3.2, at: [0.75, 0, 0] },
];

const millModel: Placement[] = [
  { src: 'mill', size: 2, at: [-0.5, 0, -0.45], turn: [0, Math.PI / 2, 0] },
  ...[[0.85, 0.35], [-0.1, 0.75], [-1.05, 0.75]].map(([x, z]): Placement => ({ src: 'flotation-tank', size: 0.85, at: [x, 0, z] })),
];

const stockpileModel: Placement[] = [
  { src: 'stockpile', size: 2.4, at: [-0.3, 0, -0.1] },
  { src: 'survey-flag', size: 1.5, at: [1.1, 0, 0.6] },
];

export const mining: Scene = {
  id: 'mining',
  caption: 'Mining · how the data is collected',
  zones: [
    { label: 'AI LAYER', rect: [11, -3.8, 14, 0.8] },
    { label: 'UNDERGROUND', rect: [-11, -9, -4, 9] },
    { label: 'PLANT', rect: [-4, -9, 4, 9] },
    { label: 'OFFICE', rect: [4, -9, 11, 9] },
  ],
  nodes: [
    { id: 'loader', role: 'source', at: [-8.9, 0.7], r: 1.9, label: 'HAUL TRUCK', model: loader, glb: loaderModel, faulted: 1, faultTag: 'BUFFERED' },
    { id: 'crusher', role: 'source', at: [-1.5, -5.8], r: 2.3, label: 'WEIGHTOMETER', model: crusher, glb: crusherModel },
    { id: 'mill', role: 'source', at: [-1.9, 1.8], r: 1.8, label: 'MILL', model: mill, glb: millModel },
    { id: 'bench', role: 'source', at: [1.8, 0.1], r: 1.1, label: 'ASSAY', model: bench, glb: [{ src: 'lab-equipment', size: 1.5 }] },
    { id: 'stockpile', role: 'source', at: [1.3, 4.3], r: 1.5, label: 'SURVEY', model: stockpile, glb: stockpileModel },
    { id: 'operator', role: 'source', at: [-2.3, 6.5], r: 0.9, label: 'OPERATOR', model: operator, glb: [{ src: 'operator', size: 1.7 }] },
    { id: 'network', role: 'edge', at: [-9.8, -7], label: 'MINE NETWORK' },
    { id: 'plc', role: 'edge', at: [2.8, -8.4], label: 'PLC' },
    { id: 'fleet', role: 'system', at: [6.8, -8], label: 'FLEET' },
    { id: 'historian', role: 'system', at: [5, -3], label: 'HISTORIAN' },
    { id: 'lab', role: 'system', at: [7.2, 0.2], label: 'LAB' },
    { id: 'reporting', role: 'system', at: [6.4, 5.1], label: 'PROD. REPORTING' },
    { id: 'balance', role: 'output', at: [9.9, 1.8], label: 'METAL BALANCE' },
    { id: 'agent', role: 'agent', at: [12.5, -1.6], label: 'AGENT' },
    { id: 'metallurgist', role: 'source', at: [10, -7.4], r: 0.6, label: 'METALLURGIST', model: operator, glb: [{ src: 'operator', size: 1.7 }] },
  ],
  links: [
    { from: 'loader', to: 'network', tag: 'PAYLOADS', signal: 'event', chip: 'PAYLOAD 226 t', faulted: 1, onFault: 'hold', lateTag: 'LATE', bend: 0.3, tagAt: 0.57 },
    { from: 'network', to: 'fleet', signal: 'event', chip: 'CYCLE 31 min', onFault: 'pause' },
    { from: 'crusher', to: 'plc', tag: 'TONNES', bend: -0.4, tagAt: 0.55 },
    { from: 'mill', to: 'plc', tag: 'TAGS', bend: 0.02, tagAt: 0.65 },
    { from: 'plc', to: 'historian', chip: '2,850 t/h', bend: 0.4 },
    { from: 'bench', to: 'lab', tag: 'GRADE', signal: 'record', chip: 'Cu 0.74%', bend: 0.29, tagAt: 0.25 },
    { from: 'operator', to: 'reporting', tag: 'SHIFT REPORT', signal: 'record', chip: '2 h DELAY', bend: -0.36, tagAt: 0.48 },
    { from: 'stockpile', to: 'reporting', signal: 'record', chip: '412 kt', bend: -0.01 },
    { from: 'fleet', to: 'balance', signal: 'event', bend: 0.4 },
    { from: 'historian', to: 'balance', bend: 0.4 },
    { from: 'lab', to: 'balance', signal: 'record', bend: -0.03 },
    { from: 'reporting', to: 'balance', signal: 'record', bend: -0.01 },
    { from: 'crusher', to: 'balance', tag: 'RECONCILE', reroute: true, bend: 0.36, tagAt: 0.52 },
    { from: 'stockpile', to: 'balance', tag: 'RECONCILE', signal: 'record', reroute: true, bend: -0.37, tagAt: 0.64 },
    ...([['fleet', 0.2], ['historian', 0], ['lab', 0], ['reporting', -0.18], ['balance', 0]] as const).map(([to, bend]) => ({ from: 'agent', to, bend, beat: 'detect' as const })),
    { from: 'agent', to: 'metallurgist', beat: 'sign', bend: 0.7 },
  ],
  agent: {
    card: ['Balance 4% short of the belt scale.', '3 trucks buffering on the haul road.', 'Hold the close until they upload.'],
    trace: ['balance', 'fleet', 'network', 'loader'],
    signer: 'metallurgist',
    correlate: ['fleet', 'historian'],
    say: {
      detect: 'Anomaly: metal balance 4% under the belt scale.',
      correlate: 'Fleet payloads vs weightometer: 3 loads missing.',
      trace: 'Traced back to the haul road. Payloads buffered.',
      recommend: 'Proposed: hold the month-end close for 3 payloads.',
      sign: 'Waiting on the metallurgist. Nothing moves until signed.',
      act: 'Late payloads land. The balance closes.',
      audit: 'Signed by metallurgist · balance closed at 100.0%',
    },
  },
};
