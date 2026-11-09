'use client';

import * as React from 'react';

import Row from '@components/Row';
import Text from '@components/Text';

function personalise(search: string, trigger: string): React.ReactNode[] {
  const p = new URLSearchParams(search);
  const lines: React.ReactNode[] = [];
  if (p.get('notices') === 'auditor') {
    lines.push('You said an auditor or a regulator would find out. That puts a date on this, and it changes the order of the work: the thing you can show them comes before the thing that is convenient for you.');
  } else if (p.get('notices') === 'customer' && trigger !== 'it-broke') {
    lines.push('You said a customer would find out first. That is the expensive way to learn about it, and it is the case worth pricing against.');
  }
  if (p.get('catches') === 'nobody') {
    lines.push('You said nobody catches it. Then there is no check to replace, and the first job is finding out what is already wrong rather than stopping it happening again.');
  } else if (p.get('catches') === 'me' && trigger !== 'its-you') {
    lines.push(
      <>
        You said you catch it yourself. <a href="/start/its-you/">That has its own page</a>, and it is probably the one you want.
      </>
    );
  }
  return lines;
}

export default function LeafProse({ trigger, paragraphs }: { trigger: string; paragraphs: string[] }) {
  const [lines, setLines] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    setLines(personalise(window.location.search, trigger));
  }, [trigger]);

  const anchor = paragraphs.findIndex((t) => t.includes('read-only access'));
  const at = anchor === -1 ? paragraphs.length : anchor;
  const all = [...paragraphs.slice(0, at), ...lines, ...paragraphs.slice(at)];

  return (
    <Row id="prose">
      {all.map((t, i) => (
        <Text key={i}>{t}</Text>
      ))}
    </Row>
  );
}
