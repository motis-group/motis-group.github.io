export type Part = {
  shape: 'box' | 'cyl';
  size: [number, number, number];
  at: [number, number, number];
  turn?: [number, number, number];
  sides?: number;
};

export type Placement = {
  src: string;
  size: number;
  at?: [number, number, number];
  turn?: [number, number, number];
};

export type Role = 'source' | 'edge' | 'system' | 'output' | 'agent';

export const SIGNALS = [
  { id: 'telemetry', name: 'Machine telemetry', ink: '--bone' },
  { id: 'event', name: 'Events and transactions', ink: '--steel' },
  { id: 'record', name: 'Human-entered records', ink: '--sand' },
  { id: 'agent', name: 'AI agent', ink: '--teal' },
] as const;

export type Signal = (typeof SIGNALS)[number]['id'];

export const STEPS = ['detect', 'correlate', 'trace', 'explain', 'recommend', 'sign', 'act', 'audit'] as const;

export type Step = (typeof STEPS)[number];

export type Node = {
  id: string;
  role: Role;
  at: [number, number];
  r?: number;
  label?: string;
  labelSide?: 'right' | 'left';
  model?: Part[];
  glb?: Placement[];
  faulted?: 1 | 2;
  faultTag?: string;
};

export type Link = {
  from: string;
  to: string;
  tag?: string;
  tagAt?: number;
  signal?: Exclude<Signal, 'agent'>;
  chip?: string;
  bend?: number;
  silent?: true;
  reroute?: true;
  faulted?: 1 | 2;
  onFault?: 'stop' | 'pause' | 'hold';
  lateTag?: string;
  faultTag?: string;
  beat?: 'detect' | 'sign';
};

export type Scene = {
  id: string;
  caption: string;
  zones: { label: string; rect: [number, number, number, number] }[];
  nodes: Node[];
  links: Link[];
  agent?: { card: string[]; trace: string[]; signer: string; correlate: string[]; say: Record<Exclude<Step, 'explain'>, string> };
};

export const PLANE: [number, number, number, number] = [-11, -9, 11, 9];

export const grid = (scene: Scene) =>
  scene.zones.reduce<[number, number, number, number]>(([a, b, c, d], { rect: [e, f, g, h] }) => [Math.min(a, e), Math.min(b, f), Math.max(c, g), Math.max(d, h)], PLANE);
