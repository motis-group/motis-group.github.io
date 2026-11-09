import Card from '@components/Card';
import Text from '@components/Text';
import { Contact, Location, Page, PageHero, Panel, Pill, Section, Stack } from '@root/site/Site';

export const metadata = { title: 'about | MOTIS.GROUP' };

export default function About() {
  return (
    <Page active="ABOUT">
      <PageHero
        kicker="About"
        heading="I work with companies that run physical things."
        lede="Electricity distribution, mining, automotive. I find where the business is quietly relying on one person to catch its mistakes, and build the thing that catches them instead."
      />

      <Section kicker="Who I am">
        <Text>
          I’m a mechanical engineer who moved into data in 2019, partly through sales engineering. I’ve spent the seven years since building and running data platforms, three of them in the US. Recent work includes regulatory compliance reporting for an automotive distributor and operational data in mining. I run Motis as a one-person firm from Melbourne. Everything on this site is me.
        </Text>
      </Section>

      <Section kicker="One question" heading="What does someone check by hand every week — and what happens the week they don’t?" intro="One question tells me most of what I need." />

      <Section kicker="The gap" heading="Somewhere a person, not a system, is the last check.">
        <Text>
          In operations like these the gap has a particular shape. The assets outlive the systems that describe them, often by decades. The engineer who knows which feeder trips in summer knows it because he was there in summer, and none of that reached the asset register. When a regulator asks you to justify the spend, the register is what you have to answer with.
        </Text>
        <Text>So somewhere a person, not a system, is the last check. They remember which contractor always reports late, which reading looks wrong in March, which of the four spreadsheets is the real one. Nobody planned it. It grew around a gap.</Text>
        <Text>That person is why things mostly work. They are also why nothing can be handed over, why nobody can take a month off, and why numbers drift for years before anybody notices.</Text>
        <Text>Operators feel this and rarely name it, because it does not present as a data problem. It presents as “Sarah does that”, which holds right up until Sarah leaves or Sarah is wrong.</Text>
      </Section>

      <Section kicker="What I do" heading="Build the thing that catches it instead.">
        <Stack>
          <Card title="Read it cold">
            <Text>Read a system cold and find where the documented process and the operating process came apart.</Text>
          </Card>
          <Card title="Write the rules down">
            <Text>In a form software can enforce, instead of a person remembering.</Text>
          </Card>
          <Card title="Checks that fail loudly">
            <Text>So nobody has to go looking. The exception surfaces itself.</Text>
          </Card>
          <Card title="Hand it over">
            <Text>The recordings and the runbook go to whoever runs it next, so they do not start from zero.</Text>
          </Card>
        </Stack>
      </Section>

      <Section kicker="Engagement" heading="Two ways in, depending on size.">
        <Stack>
          <Panel title="Small enough to look at directly">
            <Text>Read-only access for twenty minutes, and I tell you what I found whether or not there is a job in it.</Text>
          </Panel>
          <Card title="Larger, or regulated">
            <Text>A paid discovery against a named system, fixed price and fixed length, ending in a written finding you can put in front of somebody else.</Text>
          </Card>
        </Stack>
        <Text>
          Either way the build is fixed price, scoped from what the read turned up and quoted before anything starts. If it runs harder than I estimated, that is mine to wear. Anything I find outside the scope I stop and quote separately, so nothing happens that you have not agreed to.
        </Text>
        <Text>
          There is no monthly retainer, on purpose. Work priced by the month has to stay manual to stay billable, and the whole point is to delete the manual work. Occasional project work six months apart is fine. Sitting on your payroll to keep a problem alive is not.
        </Text>
        <Text>
          I turn down two kinds of work: work where the only check is somebody’s taste, because if pass and fail cannot be written down there is nothing for software to catch, and work where a model acts on your systems with no code between its judgement and the act.
        </Text>
      </Section>

      <Contact heading="Not sure which of these you are?">
        <Text>Start with three questions, or describe the problem directly.</Text>
        <Pill href="/start/">Start here →</Pill>
        <Location />
      </Contact>
    </Page>
  );
}
