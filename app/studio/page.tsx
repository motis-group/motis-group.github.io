import { Band, Close, Label, Page, PageHead } from '@root/site/ui';

export const metadata = {
  title: 'Studio | Motis',
  description: 'Motis is an independent systems engineering studio in Melbourne, run by William Marzella, its founder and principal engineer. How the studio works, and what it will not do.',
};

const LOOP = [
  ['Enter', 'Describe before building: the objective, the people, the systems, and what everyone believes the problem is.'],
  ['Map', 'People, processes, applications, data, integrations. Systems of record, and the sources of truth, which are rarely the same thing.'],
  ['Understand', 'Trace one thing end to end through the code. Where the documents and the code disagree is where the work is.'],
  ['Diagnose', 'Walk the symptom down the chain until it stops at a person or a decision.'],
  ['Find the leverage', 'The one change that moves the most downstream: a boundary, a canonical model, a manual step run five hundred times a year.'],
  ['Architect', 'Only now decide what should exist. The simplest shape that moves the constraint.'],
  ['Implement', 'The smallest correct change, in your stack, through your release process.'],
  ['Stabilise', 'Tests, alerts and a known answer, so a break announces itself.'],
  ['Document', 'The runbook and the recordings, for whoever runs it next.'],
  ['Exit', 'It runs without me.'],
];

const PRINCIPLES = [
  ['Deterministic at the edges', 'Code watches and code acts. A model judges or drafts in between. Nothing material merges without a person’s sign-off.'],
  ['A known answer first', 'Every build starts from a figure somebody has already signed. That figure tests the build, and later it tests the agent.'],
  ['Inside your perimeter', 'The work runs in your accounts, under roles you create. I ship code and hold none of your data.'],
  ['Built to be left', 'What stays behind is the system, its checks and a runbook. There is no retainer to keep a problem alive.'],
];

const QUESTIONS = [
  'What do you do differently when this number moves?',
  'Which figure do you check it against?',
  'When two reports disagree, which one do you believe?',
  'When was it last wrong, and how did you find out?',
  'Who has to agree before this definition changes?',
];

export default function Studio() {
  return (
    <Page active="Studio">
      <PageHead
        label="Studio"
        heading="A studio of one principal engineer."
        lede="Motis is an independent systems engineering studio in Melbourne. I’m William Marzella, its founder and principal engineer. The person who diagnoses your system is the person who designs and builds the fix."
      />

      <Band n="01" label="Principal">
        <div className="split">
          <h2 className="headline">Mechanical engineer first, then seven years in data.</h2>
          <div className="prose">
            <p>I trained as a mechanical engineer and moved into data in 2019, partly through sales engineering. I’ve spent the years since building and running data platforms, three of them in the United States. Recent work includes regulatory compliance reporting for an automotive distributor and operational data in mining.</p>
            <p>The sales engineering counts for more each year. The job there was to hear what somebody needed before they could specify it, then build the thing that matched. That is most of what is left of engineering work once a model writes the code.</p>
          </div>
        </div>
      </Band>

      <Band n="02" label="Philosophy">
        <div className="split">
          <h2 className="headline">Somewhere in the operation, a person is the system.</h2>
          <div className="prose">
            <p>In most operations a person, and no system, is the last check before a number goes out. They remember which contractor reports late, which reading looks wrong in March, which of four spreadsheets is the real one. Nobody planned it. It grew around a gap.</p>
            <p>That person is why things mostly work. They are also why nothing can be handed over, why nobody can take a month off, and why numbers drift for years before anybody notices.</p>
            <p>Motis finds that gap and engineers the system that closes it. One question usually locates it: what does someone check by hand every week, and what happens the week they don’t?</p>
          </div>
        </div>
      </Band>

      <Band n="03" label="Method">
        <div className="stack">
          <h2 className="headline">Ten stages. Code is the seventh.</h2>
          <ol className="steps">
            {LOOP.map(([name, body]) => (
              <li key={name}>
                <h3 className="title">{name}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band n="04" label="Principles">
        <div className="cells">
          {PRINCIPLES.map(([name, body]) => (
            <div key={name} className="cell">
              <h3 className="title">{name}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band n="05" label="Where the work went">
        <div className="split">
          <h2 className="headline">Typing the code used to hide what the job was.</h2>
          <div className="prose">
            <p>Models write most of the code I used to write, and they write it faster. I let them. What a model cannot tell you is that the number is true, because true means finance, the plant and the plan all agree with it, and that agreement lives in people.</p>
            <p>So the technical skill moved from writing to checking. I read a result for its grain, its joins and how it rolls up, and hold it against a figure somebody has already signed. I look at the numbers before the code, and open the code when the numbers are wrong.</p>
            <p>The other half is getting the meaning out of people, which is slower than any build. Five questions do most of the asking.</p>
            <ul className="bullets">
              {QUESTIONS.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <p className="dim">Part of the field calls this data intelligence engineering. A vendor coined the name. The work is what was left when the typing got cheap.</p>
          </div>
        </div>
      </Band>

      <Close heading="Want the principal on your problem?" />
    </Page>
  );
}
