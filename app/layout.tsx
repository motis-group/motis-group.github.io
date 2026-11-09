import '@root/global.css';
import '@root/site.css';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  icons: [
    { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', url: '/favicon.png' },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const THEME = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.body.className='theme-'+t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="theme-light" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME }} />
        {children}
      </body>
    </html>
  );
}
