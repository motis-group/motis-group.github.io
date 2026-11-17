import Moved from '@root/site/Moved';

export const metadata = { title: 'Studio | Motis' };

export default function Redirect() {
  return <Moved to="/studio/" name="Studio" />;
}
