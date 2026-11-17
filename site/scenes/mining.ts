import type { Part, Scene } from './types';

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

const operator: Part[] = [
  { shape: 'box', size: [0.3, 0.7, 0.2], at: [0, 0.35, 0] },
  { shape: 'box', size: [0.42, 0.58, 0.24], at: [0, 0.99, 0] },
  { shape: 'box', size: [0.2, 0.22, 0.2], at: [0, 1.41, 0] },
  { shape: 'cyl', size: [0.13, 0.17, 0.09], at: [0, 1.56, 0], sides: 8 },
  { shape: 'box', size: [0.3, 0.1, 0.1], at: [0.28, 1.02, 0.1] },
  { shape: 'box', size: [0.26, 0.34, 0.03], at: [0.42, 1.1, 0.1], turn: [0, 0, -0.6] },
];

export const mining: Scene = {
  id: 'mining',
  caption: 'Mining · how the data is collected',
  zones: [
    { label: 'UNDERGROUND', rect: [-11, -9, -4, 9] },
    { label: 'PLANT', rect: [-4, -9, 4, 9] },
    { label: 'OFFICE', rect: [4, -9, 11, 9] },
  ],
  nodes: [
    { id: 'loader', role: 'source', at: [-7.5, 1.5], r: 1.9, label: 'LOADER', model: loader, faulted: 1, faultTag: 'BUFFERED' },
    { id: 'crusher', role: 'source', at: [0, -5.2], r: 2.3, label: 'WEIGHTOMETER', model: crusher },
    { id: 'mill', role: 'source', at: [-1, 0.6], r: 1.8, label: 'MILL', model: mill },
    { id: 'bench', role: 'source', at: [2.3, 3.9], r: 1.1, label: 'ASSAY', model: bench },
    { id: 'stockpile', role: 'source', at: [0.6, 7], r: 1.5, label: 'SURVEY', model: stockpile },
    { id: 'operator', role: 'source', at: [-2.9, 4.2], r: 0.9, label: 'OPERATOR', model: operator },
    { id: 'network', role: 'edge', at: [-7, -4.6], label: 'MINE NETWORK' },
    { id: 'plc', role: 'edge', at: [2.9, -1.5], label: 'PLC' },
    { id: 'fleet', role: 'system', at: [7.4, -6.6], label: 'FLEET' },
    { id: 'historian', role: 'system', at: [7.4, -2.4], label: 'HISTORIAN' },
    { id: 'lab', role: 'system', at: [7.4, 2.2], label: 'LAB' },
    { id: 'erp', role: 'system', at: [7.4, 6.4], label: 'ERP' },
    { id: 'balance', role: 'output', at: [10, 0.9], label: 'METAL BALANCE' },
  ],
  links: [
    { from: 'loader', to: 'network', tag: 'TAGS', faulted: 1, onFault: 'hold', lateTag: 'LATE' },
    { from: 'network', to: 'fleet', bend: 0.12, onFault: 'pause' },
    { from: 'crusher', to: 'plc', tag: 'TONNES' },
    { from: 'mill', to: 'plc', tag: 'TAGS', bend: -0.2 },
    { from: 'plc', to: 'historian' },
    { from: 'bench', to: 'lab', tag: 'GRADE' },
    { from: 'operator', to: 'erp', tag: 'SHIFT REPORT', bend: -0.26 },
    { from: 'stockpile', to: 'erp', bend: 0.1 },
    { from: 'fleet', to: 'balance' },
    { from: 'historian', to: 'balance', bend: 0.1 },
    { from: 'lab', to: 'balance', bend: -0.1 },
    { from: 'erp', to: 'balance', bend: -0.2 },
    { from: 'crusher', to: 'balance', tag: 'RECONCILE', reroute: true, bend: 0.46 },
    { from: 'stockpile', to: 'balance', reroute: true, bend: -0.34 },
  ],
};
