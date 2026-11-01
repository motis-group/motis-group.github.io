import Badge from '@components/Badge';
import Card from '@components/Card';
import Row from '@components/Row';
import Table from '@components/Table';
import TableColumn from '@components/TableColumn';
import TableRow from '@components/TableRow';
import Text from '@components/Text';
import { Contact, Dither, Heading, Location, MAIL, Page, Pill, Section } from '@root/site/Chrome';

export const metadata = {
  title: 'motis.group | Data infrastructure that catches its own mistakes',
  description:
    "I build data platforms for companies that run physical things, and hand them over so they keep working after I've gone. Tests, drift alerts, and an agent that drafts fixes for a human to approve.",
};

const MOMENTS = [
  ['Someone left, or is leaving', 'The person who catches the mistakes is walking out the door, and what they know never reached the asset register.'],
  ['You got caught out', 'A number was wrong and somebody outside saw it first: a customer, an auditor, a regulator.'],
  ['It is slowing you down', 'You are the last check on your own reporting, and it costs you a week every month.'],
  ['The bills keep growing', 'The warehouse spend doubled and nobody can say which queries did it.'],
];

export default function Home() {
  return (
    <Page>
      <Row data-layout="hero">
        <Dither src="/images/dither-tower.png" />
        <Heading level={1}>Data infrastructure that catches its own mistakes</Heading>
        <Text>
          I build data platforms for companies that run physical things, and hand them over so they keep working after I’ve gone. What stays behind is software that checks the work: tests, drift alerts, and an agent that diagnoses failures and drafts the fix for a human to approve.
        </Text>
        <Pill href="/start/">Start here →</Pill>
        <Text>Data engineering · Business intelligence · Analytics, for operators of physical assets</Text>
      </Row>

      <Section>
        <Row data-layout="cards">
          <Card title="842 h">
            <Text>Dev compute added in one week</Text>
          </Card>
          <Card title="81%">
            <Text>Scheduled rebuilds colliding</Text>
          </Card>
          <Card title="0">
            <Text>Capacity upgrades needed</Text>
          </Card>
        </Row>
        <Text>A warehouse’s dev compute jumped 842 hours in a week after an ERP go-live. 81% was scheduled rebuilds colliding. Fix: lanes and schedules. Capacity upgrades needed: zero.</Text>
      </Section>

      <Section
        kicker="What I deliver"
        heading="I build the platform, then hand it over."
        intro="Most data teams drown in maintenance, and most consultants price by the month and stay. I do neither. The build is fixed price, quoted before anything starts. What stays behind is software that checks the work, and a runbook for whoever runs it next."
      >
        <Row data-layout="cards">
          <Card title="01 — Autonomous operations">
            <Text>
              A pipeline fails at 3am: the agent in your account diagnoses the root cause, writes the fix, runs the tests, and opens a pull request. The warehouse bill spikes: it finds the queries responsible and proposes the fix. Nothing merges on a model's say-so.
            </Text>
            <Text>The agent runs in your cloud account, under a role you create. It reads by default. Every change it proposes is a pull request a person approves. No credentials or data leave your account.</Text>
            <Text>↳ A platform that fixes itself, in your account, on your stack.</Text>
          </Card>
          <Card title="02 — Data engineering">
            <Text>Pipelines, modelling, and infrastructure on dbt, Snowflake, Airflow, Terraform, or whatever you already run, with lineage and tests from day one.</Text>
            <Text>↳ A warehouse you can hand over, with no one person holding it up.</Text>
          </Card>
          <Card title="03 — Business intelligence & analytics">
            <Text>Semantic layers, dashboards, and metrics that trace to source systems, not to another spreadsheet. Numbers you can put in front of a regulator or a board.</Text>
            <Text>↳ Every figure defensible from dashboard back to source.</Text>
          </Card>
        </Row>
      </Section>

      <Row data-layout="method">
        <Dither src="/images/dither-racks.png" />
        <Badge>The method</Badge>
        <Heading level={2}>Deterministic at the edges, judgment in the middle.</Heading>
        <Text>
          Code watches and code acts; the model only judges in between. Everything on a schedule or a trigger is deterministic code. The model sits in the middle, diagnosing and drafting. Nothing material merges without my sign-off. Speed from the machine, accountability from a person you can name.
        </Text>
        <Row data-layout="cards">
          <Card title="Autonomous">
            <Text>Agents diagnose, fix, verify, and open the PR before you wake.</Text>
          </Card>
          <Card title="Reviewed">
            <Text>I sign off every material change. Nothing merges itself.</Text>
          </Card>
          <Card title="Accountable">
            <Text>Measured on your systems: pipeline failures fixed before standup, warehouse spend month on month, every check that fired and what it caught.</Text>
          </Card>
        </Row>
      </Row>

      <Section
        kicker="Industries"
        heading="Built for operators of physical things."
        intro="I trained as a mechanical engineer before data, which is why the work starts from the asset, not the dashboard. Electricity distribution is what this method is built for, and where I’m concentrating. The delivered work so far is in mining, automotive and retail."
      >
        <Row data-layout="cards">
          <Card title="Focus: electricity distribution">
            <Text>Operational data verified from SCADA historian to AER submission: availability the historian will back, derating signatures explained, capex justification the regulator will fund.</Text>
            <Text>
              ↳ <a href="/projects/">Delivered work →</a>
            </Text>
          </Card>
          <Table>
            {['Electricity distribution', 'Mining', 'Automotive', 'Retail'].map((name) => (
              <TableRow key={name}>
                <TableColumn>▪ {name}</TableColumn>
              </TableRow>
            ))}
          </Table>
        </Row>
      </Section>

      <Section kicker="Who calls me" heading="People call at one of four moments.">
        <Row data-layout="cards">
          {MOMENTS.map(([role, body]) => (
            <Card key={role} title={role}>
              <Text>{body}</Text>
              <Text>
                ↳ <a href="/start/">Start here →</a>
              </Text>
            </Card>
          ))}
        </Row>
      </Section>

      <Contact heading="If the problem is real, let's talk about it.">
        <Text>I don't do capability presentations. Describe the pipeline that keeps failing, the bill that keeps growing, or the check that lives in one person's head, and I'll tell you whether I can help.</Text>
        <Pill href={MAIL}>Get in touch →</Pill>
        <Location />
        <Text>I trade as Stygian Consulting, a business name of Tenebrae Holdings Pty Ltd, ABN 44 690 270 645.</Text>
      </Contact>
    </Page>
  );
}
