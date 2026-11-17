import { CAPABILITIES, RINGS, STACK, UNSOLVED } from '@root/site/capabilities';
import Plate from '@root/site/Plate';
import { Band, Close, Label, Page, PageHead } from '@root/site/ui';
import { casesFor } from '@root/site/work';

export const metadata = {
  title: 'Capabilities | Motis',
  description: 'Systems architecture, workflow automation, applied AI, data engineering, API integration and technical advisory, each with the problem it removes and the work that shows it.',
};

export default function Capabilities() {
  return (
    <Page active="Capabilities">
      <PageHead label="Capabilities" heading="What I build, and what each one fixes." lede="Six capabilities, each stated as the problem it removes. The tools are listed last because they are the cheapest part." />

      <Band n="01" label="Six capabilities">
        <div className="rows">
          {CAPABILITIES.map((c, i) => (
            <div key={c.id} id={c.id} className="row">
              <div>
                <Label n={`0${i + 1}`}>{c.id}</Label>
                <h2 className="title">{c.name}</h2>
                <Plate name={`capability-${c.id}`} shape="tile" />
              </div>
              <div className="stack">
                <p className="lede">{c.solves}</p>
                <ul className="bullets">
                  {c.builds.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {c.proof ? <p className="dim">{c.proof}</p> : null}
                {casesFor(c.name).length ? (
                  <p className="dim">
                    Shown in:{' '}
                    {casesFor(c.name).map((k, j) => (
                      <span key={k.slug}>
                        {j ? ' · ' : ''}
                        <a href={`/work/${k.slug}/`}>{k.title}</a>
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Band>

      <Band n="02" label="Where AI stops">
        <div className="stack">
          <h2 className="headline">Six problems a model does not solve for you.</h2>
          <p className="lede">Each was there before the agents arrived. An agent makes it show sooner, to more people.</p>
          <div className="cells">
            {UNSOLVED.map(([title, body]) => (
              <div key={title} className="cell">
                <h3 className="title">{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Band>

      <Band n="03" label="Where the care goes">
        <div className="stack">
          <h2 className="headline">Care in proportion to the damage a mistake can do.</h2>
          <ol className="steps">
            {RINGS.map(([title, body]) => (
              <li key={title}>
                <h3 className="title">{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band n="04" label="Delivery">
        <div className="rows">
          <div className="row">
            <h2 className="title">A read</h2>
            <div className="prose">
              <p>For a small operation, twenty minutes with read-only access, and I say what I found whether or not there is a job in it. For a large or regulated one, a paid discovery against a named system, fixed price and fixed length, ending in a written finding.</p>
            </div>
          </div>
          <div className="row">
            <h2 className="title">A fixed-price build</h2>
            <div className="prose">
              <p>Scoped from what the read turned up and quoted before anything starts. If it runs harder than I estimated, that is mine to wear. Anything I find outside the scope I stop and quote separately.</p>
            </div>
          </div>
          <div className="row">
            <h2 className="title">No retainer</h2>
            <div className="prose">
              <p>Work priced by the month has to stay manual to stay billable, and the point is to delete the manual work. Further builds on the same systems cost less than the first, because the code already touches them.</p>
            </div>
          </div>
          <div className="row">
            <h2 className="title">Work I turn down</h2>
            <div className="prose">
              <p>Work where the only check is somebody’s taste, because if pass and fail cannot be written down there is nothing for software to catch. And work where a model acts on your systems with no code between its judgement and the act.</p>
            </div>
          </div>
        </div>
      </Band>

      <Band n="05" label="Stack">
        <p className="stackline">{STACK}</p>
      </Band>

      <Close heading="Not sure which of these is yours?">
        <p className="lede">
          <a href="/start/">Three questions</a> will place it, or describe the problem directly.
        </p>
      </Close>
    </Page>
  );
}
