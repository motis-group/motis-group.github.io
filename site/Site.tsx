import * as React from 'react';

import ActionButton from '@components/ActionButton';
import Badge from '@components/Badge';
import Card from '@components/Card';
import Grid from '@components/Grid';
import ListItem from '@components/ListItem';
import Navigation from '@components/Navigation';
import DefaultLayout from '@components/page/DefaultLayout';
import Text from '@components/Text';
import ThemeToggle from '@root/site/ThemeToggle';

export const MAIL = 'mailto:hello@motis.group';

const MENU = [
  { href: '/start/', label: 'START' },
  { href: '/projects/', label: 'PROJECTS' },
  { href: '/about/', label: 'ABOUT' },
  { href: 'https://blog.motis.group', label: 'ARTICLES', target: '_blank' },
  { href: 'https://github.com/motis-group', label: 'GITHUB', target: '_blank' },
];

const TITLE_LIMIT = 26;

export function Heading({ level, children }: { level: 1 | 2 | 3; children: React.ReactNode }) {
  return (
    <Text role="heading" aria-level={level}>
      {children}
    </Text>
  );
}

export function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  const fits = !title || title.length <= TITLE_LIMIT;
  return (
    <Card title={fits ? title : undefined}>
      {fits ? null : <Badge>{title}</Badge>}
      {children}
    </Card>
  );
}

export function Section({ kicker, heading, intro, children }: { kicker?: string; heading?: React.ReactNode; intro?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Grid>
      <Panel title={kicker}>
        {heading ? <Heading level={2}>{heading}</Heading> : null}
        {intro ? <Text>{intro}</Text> : null}
        {children}
      </Panel>
    </Grid>
  );
}

export function PageHero({ kicker, heading, lede }: { kicker?: string; heading: React.ReactNode; lede?: React.ReactNode }) {
  return (
    <Grid>
      <Panel title={kicker}>
        <Heading level={1}>{heading}</Heading>
        {lede ? <Text>{lede}</Text> : null}
      </Panel>
    </Grid>
  );
}

export function Contact({ heading, children }: { heading: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Grid>
      <Card>
        <Heading level={2}>{heading}</Heading>
        {children}
      </Card>
    </Grid>
  );
}

export function Location() {
  return (
    <Text>
      William Marzella, Melbourne — <a href={MAIL}>hello@motis.group</a>
    </Text>
  );
}

function TopBar({ minimal }: { minimal?: boolean }) {
  return (
    <Navigation
      logoHref="/"
      logo={minimal ? '⊹' : 'MOTIS.GROUP'}
      right={
        <>
          {minimal ? null : (
            <a href={MAIL}>
              <ActionButton>Get in touch</ActionButton>
            </a>
          )}
          <ThemeToggle />
        </>
      }
    />
  );
}

function Menu({ active }: { active?: string }) {
  return (
    <Grid>
      <Card>
        <ul>
          {MENU.map(({ href, label, target }) => (
            <ListItem key={label}>
              {label === active ? '▸ ' : '⊹ '}
              <a href={href} target={target}>
                {label}
              </a>
            </ListItem>
          ))}
        </ul>
      </Card>
    </Grid>
  );
}

export function Page({ active, minimal, children }: { active?: string; minimal?: boolean; children: React.ReactNode }) {
  return (
    <DefaultLayout previewPixelSRC="/favicon.png">
      <TopBar minimal={minimal} />
      {children}
      <Menu active={active} />
    </DefaultLayout>
  );
}
