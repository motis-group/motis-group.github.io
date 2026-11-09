'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import ActionButton from '@components/ActionButton';

type Theme = 'light' | 'dark';

const ICON: Record<Theme, string> = { light: '☾', dark: '☀' };

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>('light');

  React.useEffect(() => {
    setTheme(document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    const media = matchMedia('(prefers-color-scheme: dark)');
    const follow = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return;
      const next: Theme = e.matches ? 'dark' : 'light';
      Utilities.onHandleAppearanceChange(`theme-${next}`);
      setTheme(next);
    };
    media.addEventListener('change', follow);
    return () => media.removeEventListener('change', follow);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    Utilities.onHandleAppearanceChange(`theme-${next}`);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return <ActionButton onClick={toggle}>{ICON[theme]}</ActionButton>;
}
