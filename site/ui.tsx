import * as React from 'react';

import Clock from '@root/site/Clock';

export const MAIL = 'mailto:hello@motis.group';
export const ENTITY = 'Motis trades as Stygian Consulting, a business name of Tenebrae Holdings Pty Ltd, ABN 44 690 270 645.';

const MENU = [
  { href: '/capabilities/', label: 'Capabilities' },
  { href: '/work/', label: 'Work' },
  { href: '/industries/', label: 'Industries' },
  { href: '/studio/', label: 'Studio' },
  { href: '/contact/', label: 'Contact' },
];

export function Label({ n, children }: { n?: string; children: React.ReactNode }) {
  return (
    <p className="label">
      {n ? <b>{n} / </b> : null}
      {children}
    </p>
  );
}

export function Go({ href, ghost, children }: { href: string; ghost?: boolean; children: React.ReactNode }) {
  return (
    <a className={ghost ? 'btn ghost' : 'btn'} href={href}>
      {children} <span className="arr">↗</span>
    </a>
  );
}

export function Band({ n, label, children }: { n?: string; label?: string; children: React.ReactNode }) {
  return (
    <section className="band">
      <div className="wrap">
        {label ? <Label n={n}>{label}</Label> : null}
        {children}
      </div>
    </section>
  );
}

export function PageHead({ n, label, heading, lede }: { n?: string; label: string; heading: React.ReactNode; lede?: React.ReactNode }) {
  return (
    <section className="band">
      <div className="wrap stack">
        <Label n={n}>{label}</Label>
        <h1 className="display">{heading}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
    </section>
  );
}

export function Close({ heading, children }: { heading: string; children?: React.ReactNode }) {
  return (
    <section className="band">
      <div className="wrap stack">
        <h2 className="headline">{heading}</h2>
        {children}
        <div className="actions">
          <Go href="/contact/">Start a conversation</Go>
        </div>
      </div>
    </section>
  );
}

export function Page({ active, children }: { active?: string; children: React.ReactNode }) {
  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="mark" href="/">
            MOTIS
          </a>
          <nav className="menu" aria-label="Main">
            {MENU.map(({ href, label }) => (
              <a key={href} href={href} aria-current={label === active ? 'page' : undefined}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="foot">
        <div className="wrap">
          <div className="cols">
            <div className="stack">
              <p className="mark">MOTIS</p>
              <p className="label">Independent systems studio · Melbourne, Australia</p>
            </div>
            <nav className="sys" aria-label="Footer">
              {MENU.map(({ href, label }) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </nav>
            <nav className="sys" aria-label="Elsewhere">
              <a href={MAIL}>hello@motis.group</a>
              <a href="https://blog.motis.group">Articles</a>
              <a href="https://github.com/motis-group">GitHub</a>
            </nav>
          </div>
          <div className="fine">
            <p className="label">{ENTITY}</p>
            <p className="label">
              <Clock />
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
