'use client';

import * as React from 'react';

const FORMAT = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Melbourne', hour: '2-digit', minute: '2-digit', hour12: false });

export default function Clock() {
  const [now, setNow] = React.useState('');

  React.useEffect(() => {
    const tick = () => setNow(FORMAT.format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return <>MEL {now || '--:--'}</>;
}
