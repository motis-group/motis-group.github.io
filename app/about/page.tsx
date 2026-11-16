import Card from '@components/Card';
import ListItem from '@components/ListItem';
import Text from '@components/Text';
import Grid from '@components/Grid';
import Go from '@root/site/Go';
import { Contact, Location, Page, PageHero, Panel, Section } from '@root/site/Site';

export const metadata = { title: 'about | MOTIS.GROUP' };

const QUESTIONS = [
  'What do you do differently when this number moves?',
  'Which figure do you check it against?',
  'When two reports disagree, which one do you believe?',
  'When was it last wrong, and how did you find out?',
  'Who has to agree before this definition changes?',
];

export default function About() {
  return (
    <Page active="ABOUT">
      <PageHero
        kicker="About"
        heading="I work with companies that run physical things."
        lede="Electricity distribution, mining, automotive. I find what the business means by its numbers and who is quietly catching the mistakes, write both down where software and AI agents read them, and prove the answers."
      />

      <Section kicker="Who I am">
        <Text>
          I’m a mechanical engineer who moved into data in 2019, partly through sales engineering. I’ve spent the seven years since building and running data platforms, three of them in the US. Recent work includes regulatory compliance reporting for an automotive distributor and operational data in mining. I run Motis as a one-person firm from Melbourne. Everything on this site is me.
        </Text>
        <Text>
          The sales engineering is the half that counts for more each year. The job there was to hear what somebody needed before they could specify it, then build the thing that matched. That is most of what is left of data work once an agent writes the code.
        </Text>
      </Section>

      <Section kicker="Where the work went" heading="Typing the SQL used to hide what the job was.">
        <Text>
          Agents write most of the SQL I used to write, and they write it faster. I let them. What an agent cannot tell you is that the number is true, because true means finance, the plant and the plan all agree with it, and that agreement lives in people.
        </Text>
        <Text>
          So the technical skill moved from writing to checking. I read a result for its grain, its joins and how it rolls up, and hold it against a figure somebody has already signed. I look at the numbers before the code, and open the code when the numbers are wrong.
        </Text>
        <Text>
          The other half is getting the meaning out of people, which is slower than any build. Code for a metric takes minutes. Agreeing what the metric means can take weeks, because the definition is easy and the exceptions are where two teams differ: what counts, what is left out, which system wins.
        </Text>
        <Text>
          Some of the field has started calling this data intelligence engineering. The name is new and a vendor coined it. The work is what was left when the typing got cheap: write the meaning down, prove the answers, and put a name to the numbers the operation runs on.
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
        <Grid>
          <Card title="Start from the decision">
            <Text>Somebody decides something, on some day, and a number would change the choice. I find that person and that number first.</Text>
          </Card>
          <Card title="Read it cold">
            <Text>Read a system cold and find where the documented process and the operating process came apart.</Text>
          </Card>
          <Card title="Write the rules down">
            <Text>Once, in your repository, in a form software enforces and an agent reads, with an owner beside each definition.</Text>
          </Card>
          <Card title="Take a signed figure">
            <Text>A known answer for a closed period, from the person who owns the number. It tests the build, and later it tests the agent.</Text>
          </Card>
          <Card title="Checks that fail loudly">
            <Text>So nobody has to go looking. The exception surfaces itself.</Text>
          </Card>
          <Card title="Hand it over">
            <Text>The recordings and the runbook go to whoever runs it next, so they do not start from zero.</Text>
          </Card>
        </Grid>
      </Section>

      <Section kicker="What I ask" heading="Five questions do most of the asking." intro="I ask them in the room where the number gets argued, because that meeting shows what the number is for and no ticket records it.">
        <ul>
          {QUESTIONS.map((q) => (
            <ListItem key={q}>{q}</ListItem>
          ))}
        </ul>
      </Section>

      <Section kicker="Engagement" heading="Two ways in, depending on size.">
        <Grid>
          <Panel title="Small enough to look at directly">
            <Text>Read-only access for twenty minutes, and I tell you what I found whether or not there is a job in it.</Text>
          </Panel>
          <Card title="Larger, or regulated">
            <Text>A paid discovery against a named system, fixed price and fixed length, ending in a written finding you can put in front of somebody else.</Text>
          </Card>
        </Grid>
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
        <Go href="/start/">Start here →</Go>
        <Location />
      </Contact>
    </Page>
  );
}
