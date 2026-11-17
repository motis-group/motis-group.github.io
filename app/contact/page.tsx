import { Band, ENTITY, Go, Label, MAIL, Page, PageHead } from '@root/site/ui';

export const metadata = {
  title: 'Contact | Motis',
  description: 'Describe the system and the problem. I reply myself, and I will tell you whether I can help.',
};

const SEND = [
  'What the system is, and who depends on it',
  'What goes wrong, or what somebody checks by hand',
  'Who would find out if it was wrong for a week',
  'Any date already attached to it: an audit, a go-live, a person leaving',
];

export default function Contact() {
  return (
    <Page active="Contact">
      <PageHead label="Contact" heading="Let’s get to the actual problem." lede="Write to me directly. I read and answer every enquiry myself, and I will tell you whether I can help." />

      <Band n="01" label="Write">
        <div className="split">
          <div className="stack">
            <h2 className="headline">hello@motis.group</h2>
            <div className="actions">
              <Go href={MAIL}>Start a conversation</Go>
            </div>
            <p className="dim">William Marzella · Melbourne, Australia</p>
          </div>
          <div className="stack">
            <Label>Useful in a first message</Label>
            <ul className="bullets">
              {SEND.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band n="02" label="Two ways in">
        <div className="cells">
          <div className="cell">
            <h3 className="title">Small enough to look at directly</h3>
            <p>Read-only access for twenty minutes, and I tell you what I found whether or not there is a job in it.</p>
          </div>
          <div className="cell">
            <h3 className="title">Larger, or regulated</h3>
            <p>A paid discovery against a named system, fixed price and fixed length, ending in a written finding you can put in front of somebody else.</p>
          </div>
          <a className="cell" href="/start/">
            <h3 className="title">Not sure what to ask for</h3>
            <p>Three questions about what you can see day to day will place the problem and tell you what I would do about it.</p>
          </a>
        </div>
      </Band>

      <Band>
        <p className="label">{ENTITY}</p>
      </Band>
    </Page>
  );
}
