'use client';

import * as React from 'react';
import { SCENES } from './scenes';

export default function Mesh() {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const caption = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    let gone = false;
    let stop = () => {};
    Promise.all([import('./meshScene'), document.fonts.load('500 44px "Berkeley Mono"').catch(() => null)]).then(([{ mount }]) => {
      if (!gone && canvas.current && caption.current) stop = mount(canvas.current, caption.current, SCENES);
    });
    return () => {
      gone = true;
      stop();
    };
  }, []);

  return (
    <div className="mesh" aria-hidden="true">
      <canvas ref={canvas} />
      <span ref={caption} className="mesh-cap" />
    </div>
  );
}
