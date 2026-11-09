'use client';

import * as React from 'react';

import Button from '@components/Button';

export default function Go({ href, children }: { href: string; children: React.ReactNode }) {
  return <Button onClick={() => window.location.assign(href)}>{children}</Button>;
}
