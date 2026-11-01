'use client';

import * as React from 'react';

import Button from '@components/Button';

type Theme = 'light' | 'dark';

const ICON: Record<Theme, string> = { light: '☾', dark: '☀' };

function apply(theme: Theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
}

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>('light');

  React.useEffect(() => {
    setTheme(document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    const media = matchMedia('(prefers-color-scheme: dark)');
    const follow = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return;
      const next: Theme = e.matches ? 'dark' : 'light';
      apply(next);
      setTheme(next);
    };
    media.addEventListener('change', follow);
    return () => media.removeEventListener('change', follow);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    apply(next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <Button id="theme-toggle" theme="SECONDARY" onClick={toggle}>
      {ICON[theme]}
    </Button>
  );
}
