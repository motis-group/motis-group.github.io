import LeafProse from '@root/site/LeafProse';
import Go from '@root/site/Go';
import { Contact, MAIL, Page, PageHero, Section } from '@root/site/Site';
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
  return { title: `${(await leaf(params)).title} | MOTIS.GROUP` };
}

export default async function Leaf({ params }: { params: Params }) {
  const { trigger, kicker, headline, paragraphs } = await leaf(params);
  return (
    <Page active="START">
      <PageHero kicker={`Start — ${kicker}`} heading={headline} />
      <Section>
        <LeafProse trigger={trigger} paragraphs={paragraphs} />
      </Section>
      <Contact heading="If this is where you are, write to me.">
        <Go href={MAIL}>hello@motis.group →</Go>
      </Contact>
    </Page>
  );
}
