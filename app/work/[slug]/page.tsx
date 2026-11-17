import Flow from '@root/site/Flow';
import { Band, Close, Label, Page } from '@root/site/ui';
import { CASES } from '@root/site/work';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map(({ slug }) => ({ slug }));
}

async function find(params: Params) {
  const { slug } = await params;
  const index = CASES.findIndex((c) => c.slug === slug);
  return { item: CASES[index], index };
}

export async function generateMetadata({ params }: { params: Params }) {
  const { item } = await find(params);
  return { title: `${item.title} | Motis`, description: item.summary };
}

function Part({ n, name, paragraphs }: { n: string; name: string; paragraphs: string[] }) {
  return (
    <div className="row">
      <Label n={n}>{name}</Label>
      <div className="prose">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}

export default async function CaseStudy({ params }: { params: Params }) {
  const { item, index } = await find(params);
  const next = CASES[(index + 1) % CASES.length];
  return (
    <Page active="Work">
      <section className="band">
        <div className="wrap stack">
          <Label n={`0${index + 1}`}>
            <a href="/work/">Work</a> · {item.sector}
          </Label>
          <h1 className="headline" style={{ maxWidth: '18ch', fontSize: 'clamp(2.2rem, 5.6vw, 4.6rem)' }}>
            {item.title}
          </h1>
          <p className="lede">{item.summary}</p>
          <dl className="meta">
            <div>
              <dt className="label">Client</dt>
              <dd>{item.client}</dd>
            </div>
            <div>
              <dt className="label">Capabilities</dt>
              <dd>{item.capabilities.join(' · ')}</dd>
            </div>
            <div>
              <dt className="label">Status</dt>
              <dd>{item.status}</dd>
            </div>
          </dl>
        </div>
      </section>

      {item.figures ? (
        <Band>
          <div className="figures">
            {item.figures.map(([num, label]) => (
              <div key={label} className="figure">
                <p className="num">{num}</p>
                <p className="label">{label}</p>
              </div>
            ))}
          </div>
        </Band>
      ) : null}

      <Band>
        <div className="rows">
          <Part n="01" name="Context" paragraphs={item.context} />
          <Part n="02" name="Problem" paragraphs={item.problem} />
          <Part n="03" name="Architecture" paragraphs={item.architecture} />
        </div>
        <div style={{ margin: 'clamp(28px, 4vw, 56px) 0' }}>
          <Flow item={item} fig={`0${index + 1}`} />
        </div>
        <div className="rows">
          <Part n="04" name="Implementation" paragraphs={item.implementation} />
          <Part n="05" name="Outcome" paragraphs={item.outcome} />
          <div className="row">
            <Label n="06">Technical details</Label>
            <dl className="spec">
              {item.technical.map(([k, v]) => (
                <div key={k}>
                  <dt className="label">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Band>

      <Band label="Next case">
        <div className="cells">
          <a className="cell" href={`/work/${next.slug}/`}>
            <Label>
              {next.sector} · {next.client}
            </Label>
            <h2 className="title">{next.title}</h2>
            <p>{next.summary}</p>
          </a>
        </div>
      </Band>

      <Close heading="Is this the shape of your problem?" />
    </Page>
  );
}
