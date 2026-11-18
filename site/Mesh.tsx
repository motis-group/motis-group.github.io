'use client';

import * as React from 'react';
import { SCENES } from './scenes';
import { SIGNALS, STEPS } from './scenes/types';

export default function Mesh() {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const caption = React.useRef<HTMLSpanElement>(null);
  const card = React.useRef<HTMLDivElement>(null);
  const chips = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let gone = false;
    let stop = () => {};
    Promise.all([import('./meshScene'), document.fonts.load('500 44px "Berkeley Mono"').catch(() => null)]).then(([{ mount }]) => {
      if (!gone && canvas.current && caption.current && card.current && chips.current) stop = mount(canvas.current, caption.current, card.current, chips.current, SCENES);
    });
    return () => {
      gone = true;
      stop();
    };
  }, []);

  return (
    <div className="mesh" aria-hidden="true">
      <canvas ref={canvas} />
      <div ref={chips} className="mesh-chips" />
      <div ref={card} className="mesh-card" style={{ visibility: 'hidden' }}>
        <ol className="mesh-steps">
          {STEPS.map((step) => (
            <li key={step}>{step.toUpperCase()}</li>
          ))}
        </ol>
        <p className="mesh-say" />
      </div>
      <span ref={caption} className="mesh-cap" />
      <ul className="mesh-key">
        {SIGNALS.map(({ id, name, ink }) => (
          <li key={id} style={{ '--c': `var(${ink})` } as React.CSSProperties}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
