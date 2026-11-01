import * as React from 'react';

import ActionListItem from '@components/ActionListItem';
import Badge from '@components/Badge';
import Navigation from '@components/Navigation';
import Row from '@components/Row';
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

function Logos({ alt }: { alt: string }) {
  return (
    <>
      <img src="/images/logo-black.png" alt={alt} data-logo="light" />
      <img src="/images/logo-white.png" alt={alt} data-logo="dark" />
    </>
  );
}

export function Heading({ level, children }: { level: 1 | 2 | 3; children: React.ReactNode }) {
  return (
    <Text role="heading" aria-level={level}>
      {children}
    </Text>
  );
}

export function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Row data-layout="pill">
      <ActionListItem href={href} icon="⊹">
        {children}
      </ActionListItem>
    </Row>
  );
}

export function Dither({ src }: { src: string }) {
  return <img src={src} alt="" data-dither="" />;
}

export function Section({ kicker, heading, intro, children }: { kicker?: React.ReactNode; heading?: React.ReactNode; intro?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Row data-layout="section">
      {kicker ? <Badge>{kicker}</Badge> : null}
      {heading ? <Heading level={2}>{heading}</Heading> : null}
      {intro ? <Text>{intro}</Text> : null}
      {children}
    </Row>
  );
}

export function PageHero({ kicker, heading, lede }: { kicker: React.ReactNode; heading: React.ReactNode; lede?: React.ReactNode }) {
  return (
    <Row data-layout="pagehero">
      <Badge>{kicker}</Badge>
      <Heading level={1}>{heading}</Heading>
      {lede ? <Text>{lede}</Text> : null}
    </Row>
  );
}

export function Contact({ heading, children }: { heading: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Row data-layout="contact">
      <Dither src="/images/dither-wires.png" />
      <Heading level={2}>{heading}</Heading>
      {children}
    </Row>
  );
}

export function Location() {
  return (
    <Text>
      William Marzella, Melbourne — <a href={MAIL}>hello@motis.group</a>
    </Text>
  );
}

export function TopBar() {
  return (
    <Navigation
      logoHref="/"
      logo={
        <>
          <Logos alt="" />
          MOTIS.GROUP
        </>
      }
      right={
        <ActionListItem href={MAIL} icon="⊹">
          Get in touch
        </ActionListItem>
      }
    />
  );
}

export function Footer({ active }: { active?: string }) {
  return (
    <Row role="contentinfo">
      <Navigation logoHref="/" logo={<Logos alt="MOTIS.GROUP" />} right={<ThemeToggle />}>
        <Row data-layout="menu">
          {MENU.map(({ href, label, target }) => (
            <ActionListItem key={label} href={href} target={target} icon={label === active ? '▸' : '⊹'}>
              {label}
            </ActionListItem>
          ))}
        </Row>
      </Navigation>
    </Row>
  );
}

export function Page({ active, children }: { active?: string; children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Row role="main">{children}</Row>
      <Footer active={active} />
    </>
  );
}
