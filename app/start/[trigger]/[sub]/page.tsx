import LeafProse from '@root/site/LeafProse';
import { Band, Go, Label, MAIL, Page } from '@root/site/ui';
import { LEAVES } from '@root/site/leaves';

type Params = Promise<{ trigger: string; sub: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return LEAVES.map(({ trigger, sub }) => ({ trigger, sub }));
}

async function leaf(params: Params) {
  const { trigger, sub } = await params;
  return LEAVES.find((l) => l.trigger === trigger && l.sub === sub)!;
}

export async function generateMetadata({ params }: { params: Params }) {
  return { title: `${(await leaf(params)).title} | Motis` };
}

export default async function Leaf({ params }: { params: Params }) {
  const { trigger, kicker, headline, paragraphs } = await leaf(params);
  return (
    <Page active="Contact">
      <section className="band">
        <div className="wrap stack">
          <Label>
            <a href="/start/">Start</a> · {kicker}
          </Label>
          <h1 className="headline" style={{ maxWidth: '24ch' }}>
            {headline}
          </h1>
        </div>
      </section>
      <Band>
        <LeafProse trigger={trigger} paragraphs={paragraphs} />
      </Band>
      <section className="band">
        <div className="wrap stack">
          <h2 className="headline">If this is where you are, write to me.</h2>
          <div className="actions">
            <Go href={MAIL}>hello@motis.group</Go>
          </div>
        </div>
      </section>
    </Page>
  );
}
