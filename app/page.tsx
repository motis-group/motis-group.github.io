import Mesh from '@root/site/Mesh';
import Plate, { plate } from '@root/site/Plate';
import { CAPABILITIES } from '@root/site/capabilities';
import { Band, Close, Go, Label, Page } from '@root/site/ui';
import { CASES } from '@root/site/work';

export const metadata = {
  title: 'Motis | Independent systems studio, Melbourne',
  description:
    'Motis is an independent systems engineering studio. I design, build and integrate the data platforms, automations and AI workflows that complex operations run on, and prove they work before handing them over.',
};

const STEPS = [
  ['Diagnose', 'Read the system as it runs and trace one thing end to end. The stated problem is usually a symptom.'],
  ['Design', 'Decide what should exist: boundaries, ownership, the model, and the check that says it works.'],
  ['Build and integrate', 'The smallest correct change, in your stack and through your release process.'],
  ['Prove and hand over', 'Measure it against a figure somebody has signed, then leave it running without me.'],
];

const FEATURED = ['compute-attribution', 'regulatory-test-suite', 'quote-to-order'];

export default function Home() {
  const lead = CASES.find((c) => c.slug === 'compute-attribution')!;
  return (
    <Page>
      <section className="hero">
        {plate('hero') ? <Plate name="hero" shape="hero" eager /> : <Mesh />}
        <div className="wrap">
          <Label n="01">Independent systems studio · Melbourne, Australia</Label>
          <h1 className="display">Systems for operations where a wrong number costs something.</h1>
          <div className="hero-copy">
            <p className="lede">
              Motis designs, builds and integrates the data platforms, automations and AI workflows that complex operations run on. Each one is proved against a figure somebody has signed before it is handed over.
            </p>
            <div className="tags">
              {['Systems architecture', 'Automation', 'Applied AI', 'Data engineering'].map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="actions">
              <Go href="/work/">Explore the work</Go>
              <Go href="/contact/" ghost>
                Start a conversation
              </Go>
            </div>
          </div>
        </div>
      </section>

      <Band>
        <div className="split">
          <div className="stack">
            <Label>From the work · {lead.client}</Label>
            <p className="title">{lead.summary}</p>
            <p>
              <a href={`/work/${lead.slug}/`}>Read the case ↗</a>
            </p>
          </div>
          <div className="figures">
            {lead.figures!.map(([num, label]) => (
              <div key={label} className="figure">
                <p className="num">{num}</p>
                <p className="label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Band>

      <Band n="02" label="Capabilities">
        <div className="stack">
          <h2 className="headline">Six things I build, and the problem each one removes.</h2>
          <div className="cells three">
            {CAPABILITIES.map((c) => (
              <a key={c.id} className="cell" href={`/capabilities/#${c.id}`}>
                <h3 className="title">{c.name}</h3>
                <p>{c.short}</p>
              </a>
            ))}
          </div>
        </div>
      </Band>

      <Band n="03" label="Selected work">
        <div className="stack">
          <h2 className="headline">Built inside operations that were already running.</h2>
          <div className="cells">
            {FEATURED.map((slug) => CASES.find((c) => c.slug === slug)!).map((c) => (
              <a key={c.slug} className="cell" href={`/work/${c.slug}/`}>
                <Plate name={`work-${c.slug}`} />
                <Label>
                  {c.sector} · {c.client}
                </Label>
                <h3 className="title">{c.title}</h3>
                <p>{c.summary}</p>
                <div className="tags">
                  {c.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
          <div className="actions">
            <Go href="/work/" ghost>
              All six case studies
            </Go>
          </div>
        </div>
      </Band>

      <Band n="04" label="Approach">
        <div className="stack">
          <h2 className="headline">Understand the system. Find the leverage. Build it. Prove it.</h2>
          <ol className="steps">
            {STEPS.map(([name, body]) => (
              <li key={name}>
                <h3 className="title">{name}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="dim">
            Code is the third step of four. <a href="/studio/">How the studio works ↗</a>
          </p>
        </div>
      </Band>

      <Band n="05" label="Why now">
        <div className="split">
          <h2 className="headline">AI writes the code now. The scarce work moved to either side of it.</h2>
          <div className="prose">
            <p>A model can produce a pipeline, a query or an integration in minutes. It cannot tell you which number the board relies on, which of two systems is right, or what your people mean by a word.</p>
            <p>So the engineering that still costs something happens before the code and after it: finding what the operation needs the system to do, and proving that what was built is right. That is the work Motis does, and it uses the models for the part in between.</p>
            <p>
              <a href="/capabilities/#ai">What a model does not solve ↗</a>
            </p>
          </div>
        </div>
      </Band>

      <Close heading="Have a complex system to build, or one nobody trusts?">
        <p className="lede">I don’t do capability presentations. Describe the problem and I’ll tell you whether I can help.</p>
      </Close>
    </Page>
  );
}
