'use client';

import * as React from 'react';

import Button from '@components/Button';
import Card from '@components/Card';
import RadioButton from '@components/RadioButton';
import Text from '@components/Text';
import { Stack } from '@root/site/Site';

const QUESTIONS: { q: string; num: string; text: string; options: [string, string][] }[] = [
  {
    q: 'q1',
    num: '01',
    text: 'When something is wrong in your numbers, who catches it?',
    options: [
      ['person', 'a specific person'],
      ['system', 'a system'],
      ['nobody', 'honestly, nobody'],
      ['me', 'me'],
    ],
  },
  {
    q: 'q2',
    num: '02',
    text: 'What made you look into this now?',
    options: [
      ['someone-left', 'someone left, or is leaving'],
      ['it-broke', 'we got caught out'],
      ['its-you', 'it is slowing us down'],
      ['costs', 'the bills keep growing'],
      ['not-sure', 'just having a look'],
    ],
  },
  {
    q: 'q3',
    num: '03',
    text: 'If your numbers were wrong for a week, who would find out?',
    options: [
      ['customer', 'a customer'],
      ['auditor', 'an auditor or a regulator'],
      ['us', 'just us'],
      ['nobody', 'nobody'],
    ],
  },
];

const EXPOSED: Record<string, string> = { 'someone-left': 'exposed', 'its-you': 'exposed', 'it-broke': 'outside', 'not-sure': 'exposed', costs: 'exposed' };
const QUIET: Record<string, string> = { 'someone-left': 'quiet', 'its-you': 'quiet', 'it-broke': 'caught', 'not-sure': 'quiet', costs: 'quiet' };

function destination(picked: Record<string, string>): string | null {
  if (!picked.q1 || !picked.q2 || !picked.q3) return null;
  const params = new URLSearchParams();
  params.set('catches', picked.q1);
  params.set('notices', picked.q3);
  const seen = picked.q3 === 'customer' || picked.q3 === 'auditor';
  return `/start/${picked.q2}/${(seen ? EXPOSED : QUIET)[picked.q2]}/?${params}`;
}

export default function Quiz() {
  const [picked, setPicked] = React.useState<Record<string, string>>({});
  const href = destination(picked);

  return (
    <Stack>
      {QUESTIONS.map(({ q, num, text, options }) => (
        <Card key={q} title={num}>
          <Text>{text}</Text>
          {options.map(([v, label]) => (
            <RadioButton key={v} name={q} value={v} selected={picked[q] === v} onSelect={(value) => setPicked((prev) => ({ ...prev, [q]: value }))}>
              {label}
            </RadioButton>
          ))}
        </Card>
      ))}
      {href ? <Button onClick={() => window.location.assign(href)}>continue ⊹</Button> : <Button isDisabled>answer all three to continue</Button>}
    </Stack>
  );
}
