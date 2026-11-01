'use client';

import itemStyles from '@components/ActionListItem.module.css';
import buttonStyles from '@components/Button.module.css';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Card from '@components/Card';

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
  const go = React.useRef<HTMLAnchorElement>(null);
  const href = destination(picked);
  const ready = href !== null;

  React.useEffect(() => {
    if (ready) go.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [ready]);

  return (
    <>
      {QUESTIONS.map(({ q, num, text, options }) => (
        <Card key={q} title={`${num} ${text}`}>
          {options.map(([v, label]) => {
            const chosen = picked[q] === v;
            return (
              <a
                key={v}
                href="#"
                className={Utilities.classNames('opt', itemStyles.item, chosen ? 'chosen' : null)}
                data-q={q}
                data-v={v}
                onClick={(e) => {
                  e.preventDefault();
                  setPicked((prev) => ({ ...prev, [q]: v }));
                }}
              >
                <figure className={itemStyles.icon}>{chosen ? '✓' : '⊹'}</figure>
                <span className={itemStyles.text}>{label}</span>
              </a>
            );
          })}
        </Card>
      ))}
      <a
        id="go"
        ref={go}
        href={href ?? '#'}
        className={ready ? Utilities.classNames(buttonStyles.root, buttonStyles.primary) : Utilities.classNames(buttonStyles.root, buttonStyles.disabled, 'disabled-link')}
      >
        {ready ? 'continue ⊹' : 'answer all three to continue'}
      </a>
    </>
  );
}
