import Accordion from '@components/Accordion';
import Card from '@components/Card';
import ListItem from '@components/ListItem';
import Table from '@components/Table';
import TableColumn from '@components/TableColumn';
import TableRow from '@components/TableRow';
import Text from '@components/Text';
import Grid from '@components/Grid';
import Go from '@root/site/Go';
import { Contact, Location, MAIL, Page, PageHero, Section } from '@root/site/Site';

export const metadata = {
  title: 'motis.group | An agent can write the query. Someone still has to answer for the number.',
  description:
    'Data intelligence engineering for companies that run physical things. I write down what the business means by its numbers where software and AI agents read it, and prove the answers against figures somebody has signed.',
};

const STATS = [
  ['842 h', 'Dev compute added in one week'],
  ['81%', 'Scheduled rebuilds colliding'],
  ['0', 'Capacity upgrades needed'],
];

const MOMENTS = [
  ['Someone left, or is leaving', 'The person who catches the mistakes is walking out the door, and what they know never reached the asset register.'],
  ['You got caught out', 'A number was wrong and somebody outside saw it first: a customer, an auditor, a regulator.'],
  ['It is slowing you down', 'You are the last check on your own reporting, and it costs you a week every month.'],
  ['The bills keep growing', 'The warehouse spend doubled and nobody can say which queries did it.'],
  ['An agent is answering now', 'You put an AI agent on your data, people act on what it says, and nobody can tell you how often it is right.'],
];

const UNSOLVED = [
  [
    'One word, three meanings',
    'The same metric name means different things at different sites, because each site records on a different system. The definition lives in a spreadsheet, in two or three heads, and in whichever report was built first. An agent reading your warehouse finds the name and no trace of what you agreed it means.',
  ],
  [
    'Nobody can say how often the agent is right',
    'A wrong dashboard is wrong the same way every day until somebody notices. An agent writes a new query for each question, so changing a synonym or a filter changes its answers while the table underneath stays put. Without a list of questions whose answers you already know, the person who finds the error is whoever asked.',
  ],
  [
    'A rate added up like a total',
    'Ask for a utilisation rate over a week and an agent with no roll-up rule adds seven daily rates together. How a number adds up across days and sites is part of what it means, and most warehouses store that nowhere.',
  ],
  [
    'The rule lives in one person',
    'Somebody knows which contractor reports late and which reading looks wrong in March for a reason. None of it is in the data, so a model cannot learn it from the data. Somebody has to sit with that person and write it down.',
  ],
  [
    'Nobody has signed the number',
    'A figure that goes to a board or a regulator needs a person who will answer for it. A model cannot be that person. Before an agent serves the figure, somebody has to own the definition, and somebody has to say which run proved it.',
  ],
  [
    'Queries nobody budgeted',
    'Asking is free for the person asking and billed to the warehouse. Self-serve tools and agents multiply the queries, and the bill arrives as a total with no cause attached.',
  ],
];

const RINGS = [
  ['The core', 'The few numbers the operation runs on, and every number that leaves the building. Each has one definition, an owner, tests, and a signed figure to check against. These stay predictable.'],
  ['What teams rely on', 'The reports and metrics built on the core. They are generated from the same definitions and covered by the agent’s test questions. A break gets fixed fast.'],
  ['Everything else', 'Ad hoc questions and whatever anyone builds on top. They get a sound foundation and no promise.'],
];

export default function Home() {
  return (
    <Page>
      <PageHero
        heading="An agent can write the query. Someone still has to answer for the number."
        lede="I work with companies that run physical things. AI agents now do most of the building, so I do the work they leave: get what the business means by its numbers out of people’s heads, write it where software and agents read it, and prove each answer against a figure somebody has already signed."
      />
      <Grid>
        <Go href="/start/">Start here →</Go>
        <Text>Data intelligence engineering: data engineering, analytics, and the definitions your AI agents read, for operators of physical assets</Text>
      </Grid>

      <Grid>
        <Table>
          {STATS.map(([value, label]) => (
            <TableRow key={label}>
              <TableColumn>{value}</TableColumn>
              <TableColumn>{label}</TableColumn>
            </TableRow>
          ))}
        </Table>
        <Text>A warehouse’s dev compute jumped 842 hours in a week after an ERP go-live. 81% was scheduled rebuilds colliding. Fix: lanes and schedules. Capacity upgrades needed: zero.</Text>
      </Grid>

      <Section kicker="What changed" heading="Getting an answer is cheap now. Knowing it is right still costs.">
        <Text>A question used to pass from the person who cared, to an analyst, to an engineer, and back. Every pass meant waiting, and every pass lost some of why the question was asked.</Text>
        <Text>An agent can now carry a question the whole way: fetch the data, reshape it, query it, chart it. Almost anyone in the business can have an answer in minutes, and ask the follow-up while the context is still in their head.</Text>
        <Text>
          The agent knows SQL. It does not know what you mean by availability, which of five similar tables is the real one, or that operations and finance count the same word differently. Ask it anyway and it hands back a clean, confident, wrong number.
        </Text>
      </Section>

      <Section kicker="What still needs solving" heading="Six problems a model does not solve for you." intro="Each of these was there before the agents arrived. An agent makes it show sooner, to more people.">
        {UNSOLVED.map(([title, body]) => (
          <Accordion key={title} defaultValue title={title}>
            <Text>{body}</Text>
          </Accordion>
        ))}
      </Section>

      <Section
        kicker="What I deliver"
        heading="The meaning, the proof, and a platform I hand over."
        intro="Most data teams drown in maintenance, and most consultants price by the month and stay. I do neither. The build is fixed price, quoted before anything starts. What stays behind is the definitions, the checks that prove them, and a runbook for whoever runs it next."
      >
        <Accordion defaultValue title="01 — Meaning a machine can read">
          <Text>
            I sit with the people who own each number and get the definition written once, in your repository: what counts, what is left out, the grain, the unit, how it rolls up, which system wins when two disagree, and who has to agree before it changes.
          </Text>
          <Text>The semantic layer your reports and agents read is generated from those definitions. A new metric enters the agent’s vocabulary in the same change that adds it to the warehouse.</Text>
          <Text>↳ One definition per number, read by people, reports and agents alike.</Text>
        </Accordion>
        <Accordion defaultValue title="02 — Answers checked against signed figures">
          <Text>
            Every definition comes with a known answer: a figure its owner has already signed for a closed period. That figure becomes a test on the pipeline and a question the agent is marked on. The questions run on every change, the pass rate is the agent’s accuracy, and a drop blocks the release.
          </Text>
          <Text>↳ You can say how often the agent is right, and point at the run that shows it.</Text>
        </Accordion>
        <Accordion defaultValue title="03 — The platform underneath">
          <Text>Pipelines, modelling, and infrastructure on dbt, Snowflake, Fabric, Airflow, Terraform, or whatever you already run, with lineage and tests from day one.</Text>
          <Text>
            A pipeline fails at 3am: the agent in your account diagnoses the root cause, writes the fix, runs the tests, and opens a pull request. It runs under a role you create and reads by default. Nothing merges on a model’s say-so, and no credentials or data leave your account.
          </Text>
          <Text>↳ A warehouse you can hand over, with no one person holding it up.</Text>
        </Accordion>
      </Section>

      <Section
        kicker="The method"
        heading="Deterministic at the edges, judgment in the middle."
        intro="Code watches and code acts; the model only judges in between. Everything on a schedule or a trigger is deterministic code. The model sits in the middle, diagnosing and drafting. Nothing material merges without my sign-off. Speed from the machine, accountability from a person you can name."
      >
        <Grid>
          <Card title="Autonomous">
            <Text>Agents diagnose, fix, verify, and open the PR before you wake.</Text>
          </Card>
          <Card title="Reviewed">
            <Text>I sign off every material change. Nothing merges itself.</Text>
          </Card>
          <Card title="Accountable">
            <Text>Measured on your systems: pipeline failures fixed before standup, warehouse spend month on month, every check that fired and what it caught.</Text>
          </Card>
        </Grid>
      </Section>

      <Section kicker="Where the care goes" heading="Care in proportion to the damage a mistake can do." intro="A lunch order can be wrong. The number the board sees cannot. I sort your numbers into three rings and spend the checking where a mistake costs most.">
        <Grid>
          {RINGS.map(([title, body]) => (
            <Card key={title} title={title}>
              <Text>{body}</Text>
            </Card>
          ))}
        </Grid>
        <Text>The core comes first, because an agent that reads a wrong number repeats it with confidence.</Text>
      </Section>

      <Section
        kicker="Industries"
        heading="Built for operators of physical things."
        intro="I trained as a mechanical engineer before data, which is why the work starts from the asset, not the dashboard. Electricity distribution is what this method is built for, and where I’m concentrating. The delivered work so far is in mining, automotive and retail."
      >
        <Accordion defaultValue title="Focus: electricity distribution">
          <Text>Operational data verified from SCADA historian to AER submission: availability the historian will back, derating signatures explained, capex justification the regulator will fund.</Text>
          <Text>
            ↳ <a href="/projects/">Delivered work →</a>
          </Text>
        </Accordion>
        <ul>
          {['Electricity distribution', 'Mining', 'Automotive', 'Retail'].map((name) => (
            <ListItem key={name}>{name}</ListItem>
          ))}
        </ul>
      </Section>

      <Section kicker="Who calls me" heading="People call at one of five moments.">
        {MOMENTS.map(([role, body]) => (
          <Accordion key={role} defaultValue title={role}>
            <Text>{body}</Text>
            <Text>
              ↳ <a href="/start/">Start here →</a>
            </Text>
          </Accordion>
        ))}
      </Section>

      <Contact heading="If the problem is real, let's talk about it.">
        <Text>I don't do capability presentations. Describe the number nobody trusts, the agent nobody has tested, the bill that keeps growing, or the check that lives in one person's head, and I'll tell you whether I can help.</Text>
        <Go href={MAIL}>Get in touch →</Go>
        <Location />
        <Text>I trade as Stygian Consulting, a business name of Tenebrae Holdings Pty Ltd, ABN 44 690 270 645.</Text>
      </Contact>
    </Page>
  );
}
