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

export type Role = 'source' | 'edge' | 'system' | 'output';

export type Node = {
  id: string;
  role: Role;
  at: [number, number];
  r?: number;
  label?: string;
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
  bend?: number;
  silent?: true;
  reroute?: true;
  faulted?: 1 | 2;
  onFault?: 'stop' | 'pause' | 'hold';
  lateTag?: string;
  faultTag?: string;
};

export type Scene = {
  id: string;
  caption: string;
  zones: { label: string; rect: [number, number, number, number] }[];
  nodes: Node[];
  links: Link[];
};

export const PLANE: [number, number, number, number] = [-11, -9, 11, 9];
