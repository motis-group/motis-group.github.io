import * as React from 'react';

const COLS = 13;
const ROWS = 9;
const W = 44;
const H = 22;

function heights(): number[][] {
  let seed = 20261117;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      const ridge = Math.exp(-((c - 8) ** 2 + (r - 3.5) ** 2) / 14);
      const roll = next();
      return roll < 0.22 ? 0 : Math.round(8 + roll * 34 + ridge * 120);
    })
  );
}

export default function Field() {
  const grid = heights();
  const ox = ROWS * (W / 2) + 4;
  const oy = 176;
  const columns: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const h = grid[r][c];
      const x = ox + (c - r) * (W / 2);
      const y = oy + (c + r) * (H / 2);
      const top = `${x},${y - h} ${x + W / 2},${y + H / 2 - h} ${x},${y + H - h} ${x - W / 2},${y + H / 2 - h}`;
      const left = `${x - W / 2},${y + H / 2 - h} ${x},${y + H - h} ${x},${y + H} ${x - W / 2},${y + H / 2}`;
      const right = `${x + W / 2},${y + H / 2 - h} ${x},${y + H - h} ${x},${y + H} ${x + W / 2},${y + H / 2}`;
      const lit = h > 96;
      columns.push(
        <g key={`${r}-${c}`} className="col" style={{ ['--i' as string]: (r * 3 + c * 5) % 19 }}>
          {h > 0 ? <polygon points={left} fill="rgba(163,173,116,0.10)" stroke="rgba(233,228,216,0.22)" strokeWidth="0.75" /> : null}
          {h > 0 ? <polygon points={right} fill="rgba(163,173,116,0.04)" stroke="rgba(233,228,216,0.22)" strokeWidth="0.75" /> : null}
          <polygon points={top} fill={lit ? 'rgba(163,173,116,0.42)' : h > 0 ? 'rgba(233,228,216,0.07)' : 'none'} stroke={lit ? 'rgba(163,173,116,0.95)' : 'rgba(233,228,216,0.26)'} strokeWidth="0.75" />
        </g>
      );
    }
  }
  const width = (COLS + ROWS) * (W / 2) + 8;
  const height = oy + (COLS + ROWS) * (H / 2) + 12;
  return (
    <svg className="field" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      {columns}
    </svg>
  );
}
