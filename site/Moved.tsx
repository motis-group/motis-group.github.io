import { Band, Page } from '@root/site/ui';

export default function Moved({ to, name }: { to: string; name: string }) {
  return (
    <Page>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={to} />
      <Band label="Moved">
        <p className="lede">
          This page is now <a href={to}>{name}</a>.
        </p>
      </Band>
    </Page>
  );
}
