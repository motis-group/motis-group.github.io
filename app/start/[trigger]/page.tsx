import Moved from '@root/site/Moved';
import { LEAVES } from '@root/site/leaves';

export const metadata = { title: 'Start | Motis' };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(LEAVES.map((l) => l.trigger))].map((trigger) => ({ trigger }));
}

export default function Redirect() {
  return <Moved to="/start/" name="three questions, so you land on the right page" />;
}
