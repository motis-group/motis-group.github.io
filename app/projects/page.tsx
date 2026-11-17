import Moved from '@root/site/Moved';

export const metadata = { title: 'Work | Motis' };

export default function Redirect() {
  return <Moved to="/work/" name="Work" />;
}
