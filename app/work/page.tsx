import Plate from '@root/site/Plate';
import { Band, Close, Label, Page, PageHead } from '@root/site/ui';
import { CASES } from '@root/site/work';

export const metadata = {
  title: 'Work | Motis',
  description: 'Six anonymised case studies in mining, automotive, retail and manufacturing: the problem, the architecture, what was built, and what stayed behind.',
};

export default function Work() {
  return (
    <Page active="Work">
      <PageHead label="Selected work" heading="Six engagements, and what stayed behind." lede="Clients are not named. Each case gives the context, the problem, the architecture, what was built and what it changed. Where I have a measured figure it is shown, and where I don’t I say what was handed over." />
      <Band>
        <div className="cells">
          {CASES.map((c, i) => (
            <a key={c.slug} className="cell" href={`/work/${c.slug}/`}>
              <Plate name={`work-${c.slug}`} />
              <Label n={`0${i + 1}`}>
                {c.sector} · {c.client}
              </Label>
              <h2 className="title">{c.title}</h2>
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
      </Band>
      <Close heading="Recognise one of these?" />
    </Page>
  );
}
