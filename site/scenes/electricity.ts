import type { Part, Scene } from './types';

const AXLE: [number, number, number] = [Math.PI / 2, 0, 0];

const pole = (x: number, height = 2.2): Part[] => [
  { shape: 'cyl', size: [0.05, 0.07, height], at: [x, height / 2, 0], sides: 6 },
  { shape: 'box', size: [0.07, 0.07, 1], at: [x, height - 0.2, 0] },
];

const house = (x: number, z: number, solar = false): Part[] => [
  { shape: 'box', size: [0.75, 0.45, 0.62], at: [x, 0.225, z] },
  { shape: 'cyl', size: [0.5, 0.5, 0.7], at: [x, 0.7, z], turn: [-Math.PI / 2, 0, 0], sides: 3 },
  { shape: 'box', size: [0.1, 0.16, 0.05], at: [x - 0.2, 0.28, z + 0.33] },
  ...(solar ? [{ shape: 'box', size: [0.36, 0.03, 0.5], at: [x + 0.24, 0.84, z], turn: [0, 0, -Math.PI / 3] } as Part] : []),
];

const substation: Part[] = [
  { shape: 'box', size: [1, 0.85, 0.7], at: [-0.6, 0.55, 0] },
  { shape: 'box', size: [0.12, 0.7, 0.62], at: [-1.2, 0.5, 0] },
  { shape: 'box', size: [0.12, 0.7, 0.62], at: [0, 0.5, 0] },
  { shape: 'cyl', size: [0.14, 0.14, 0.8], at: [-0.6, 1.2, 0], turn: [0, 0, Math.PI / 2], sides: 8 },
  ...[-0.22, 0, 0.22].map((z): Part => ({ shape: 'cyl', size: [0.04, 0.08, 0.4], at: [-0.6, 1.5, z], sides: 6 })),
  { shape: 'box', size: [0.4, 0.45, 0.6], at: [0.85, 0.75, 0] },
  { shape: 'box', size: [0.06, 0.5, 0.06], at: [0.85, 0.25, 0] },
  ...[-0.2, 0, 0.2].map((z): Part => ({ shape: 'cyl', size: [0.03, 0.06, 0.5], at: [0.85, 1.2, z], sides: 6 })),
  { shape: 'cyl', size: [0.04, 0.04, 1.9], at: [1.6, 0.95, -0.6], sides: 6 },
  { shape: 'cyl', size: [0.04, 0.04, 1.9], at: [1.6, 0.95, 0.6], sides: 6 },
  { shape: 'box', size: [0.07, 0.07, 1.3], at: [1.6, 1.9, 0] },
];

const recloser: Part[] = [
  ...pole(-1.1),
  ...pole(1.1),
  ...[-0.42, 0, 0.42].map((z): Part => ({ shape: 'box', size: [2.2, 0.015, 0.015], at: [0, 2.04, z] })),
  { shape: 'box', size: [0.32, 0.42, 0.3], at: [-0.86, 1.45, 0] },
  ...[-0.1, 0.1].map((z): Part => ({ shape: 'cyl', size: [0.03, 0.05, 0.25], at: [-0.86, 1.78, z], sides: 6 })),
];

const transformer: Part[] = [
  ...pole(0),
  { shape: 'cyl', size: [0.22, 0.22, 0.5], at: [0.3, 1.5, 0], sides: 8 },
  { shape: 'cyl', size: [0.03, 0.05, 0.2], at: [0.3, 1.85, 0], sides: 6 },
];

const houses: Part[] = [...house(-1, -0.7), ...house(0.4, -0.95, true), ...house(-0.45, 0.75), ...house(1, 0.55)];

const crew: Part[] = [
  { shape: 'box', size: [0.95, 0.22, 0.78], at: [-0.5, 0.52, 0] },
  { shape: 'box', size: [0.62, 0.55, 0.78], at: [0.3, 0.68, 0] },
  { shape: 'box', size: [0.45, 0.3, 0.78], at: [0.83, 0.56, 0] },
  { shape: 'box', size: [1.3, 0.04, 0.3], at: [-0.25, 1.05, 0] },
  { shape: 'box', size: [0.04, 0.4, 0.6], at: [-0.9, 0.83, 0] },
  ...[-0.6, 0.7].flatMap((x) => [-0.4, 0.4].map((z): Part => ({ shape: 'cyl', size: [0.2, 0.2, 0.16], at: [x, 0.2, z], turn: AXLE }))),
];

const tie: Part[] = [...pole(0, 1.8), { shape: 'box', size: [0.5, 0.12, 0.2], at: [0, 1.75, 0.3] }];

export const electricity: Scene = {
  id: 'electricity',
  caption: 'Electricity distribution · how the data is collected',
  zones: [
    { label: 'ZONE SUBSTATION', rect: [-11, -1.6, -4, 9] },
    { label: 'FEEDER', rect: [-4, -1.6, 4, 9] },
    { label: 'LOW VOLTAGE', rect: [4, -1.6, 11, 9] },
  ],
  nodes: [
    { id: 'substation', role: 'source', at: [-7.5, 3.2], r: 2.2, label: 'TRANSFORMER · BREAKER', model: substation },
    { id: 'recloser', role: 'source', at: [-0.6, 3.2], r: 1.8, label: 'RECLOSER', model: recloser, faulted: 1, faultTag: 'OUTAGE' },
    { id: 'transformer', role: 'source', at: [5.3, 3.2], r: 1, label: 'POLE-TOP TRANSFORMER', model: transformer },
    { id: 'houses', role: 'source', at: [8.5, 4.9], r: 2.1, label: 'SMART METERS', model: houses },
    { id: 'crew', role: 'source', at: [2.6, 0], r: 1.2, label: 'FIELD CREW', model: crew },
    { id: 'adjacent', role: 'source', at: [-2.2, 7.4], r: 0.9, label: 'ADJACENT FEEDER', model: pole(0) },
    { id: 'tie', role: 'source', at: [3.5, 7.7], r: 0.8, label: 'TIE SWITCH', model: tie },
    { id: 'rtu', role: 'edge', at: [-5, -0.4], label: 'RTU' },
    { id: 'collector', role: 'edge', at: [9.2, 0.4], label: 'METER COMMS' },
    { id: 'scada', role: 'system', at: [-7.5, -4.6], label: 'SCADA' },
    { id: 'historian', role: 'system', at: [-3.6, -6.4], label: 'HISTORIAN' },
    { id: 'gis', role: 'system', at: [2.6, -4.2], label: 'GIS' },
    { id: 'register', role: 'system', at: [5.6, -6.6], label: 'ASSET REGISTER' },
    { id: 'meterdata', role: 'system', at: [9.2, -3.8], label: 'METER DATA' },
    { id: 'model', role: 'output', at: [0.8, -7.4], label: 'NETWORK MODEL' },
  ],
  links: [
    { from: 'substation', to: 'recloser', silent: true },
    { from: 'recloser', to: 'transformer', silent: true, faulted: 2 },
    { from: 'transformer', to: 'houses', silent: true },
    { from: 'substation', to: 'rtu', tag: 'TELEMETRY', bend: -0.2 },
    { from: 'rtu', to: 'scada' },
    { from: 'recloser', to: 'scada', tag: 'TELEMETRY', bend: 0.14 },
    { from: 'scada', to: 'historian', bend: -0.2 },
    { from: 'houses', to: 'collector', tag: 'INTERVAL', onFault: 'pause' },
    { from: 'collector', to: 'meterdata', bend: 0.1, onFault: 'pause' },
    { from: 'crew', to: 'gis', tag: 'AS-BUILT' },
    { from: 'gis', to: 'register', bend: -0.2 },
    { from: 'scada', to: 'model', bend: -0.22 },
    { from: 'historian', to: 'model', bend: -0.15 },
    { from: 'gis', to: 'model', bend: 0.15 },
    { from: 'register', to: 'model', bend: 0.15 },
    { from: 'meterdata', to: 'model', bend: 0.25 },
    { from: 'adjacent', to: 'tie', tag: 'REROUTING', silent: true, reroute: true },
    { from: 'tie', to: 'transformer', silent: true, reroute: true, bend: -0.2 },
  ],
};
