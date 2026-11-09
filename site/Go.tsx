import * as React from 'react';

import Button from '@components/Button';

export default function Go({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href}>
      <Button tabIndex={-1}>{children}</Button>
    </a>
  );
}
