import Text from '@components/Text';
import { Contact, Location, Page, PageHero, Pill, Section } from '@root/site/Site';

export const metadata = { title: 'projects | MOTIS.GROUP' };

export default function Projects() {
  return (
    <Page active="PROJECTS">
      <PageHero
        kicker="Projects"
        heading="Four engagements, and what stayed behind."
        lede="Clients are not named. What is here is the shape of the problem and the thing that kept working after I handed it over."
      />

      <Section kicker="A check caught it first · Australian miner, production accounting on dbt and Snowflake" heading="The test failed in UAT, where it was supposed to.">
        <Text>A production accounting model was gaining quarterly figures beside its monthly ones. Downstream, a weekly performance board read the same tables, and one of its tests listed the time grains it expected to see.</Text>
        <Text>
          When the accounting release reached the test environment, the board’s run failed that test. Nothing had reached production. The new grains were correct, so the fix was to widen the board’s list on the sources it reads and ship both changes in one release.
        </Text>
        <Text>Every release runs the same way: deployed to test, validated there, and only then raised as a production change, copied from the last one that went through clean.</Text>
        <Text>↳ Ongoing. What stays behind: the release steps written down, and tests on the readers downstream of a model, not only on the model that changed.</Text>
      </Section>

      <Section kicker="The bills kept growing · automotive distributor, Microsoft Fabric" heading="Nobody had scheduled the warehouse.">
        <Text>
          A new ERP went live and the analytics platform behind it started running hot. The question on the table was how much more capacity to buy. Nobody could say which workloads were using what, because model rebuilds, batch loads, and report queries all shared one lane and collided freely.
        </Text>
        <Text>
          I read the query history for the week either side of the go-live and attributed every hour of compute to a workload and an owner. One family of models accounted for more than a third of the increase in development. In test the driver was reporting reruns rather than builds, so the two environments needed different fixes.
        </Text>
        <Text>The recommendation was operational: separate lanes for builds, loads, and reports, a freeze on new scheduled models until approved, and the worst overlap windows broken up. Buying capacity stayed on the list as a fallback.</Text>
        <Text>↳ What stayed behind: the attribution queries as a playbook anyone on the team can rerun, and a runbook for the next time the numbers creep.</Text>
      </Section>

      <Section kicker="A regulator would find out · Australian automotive distributor, regulatory reporting for a new federal efficiency standard" heading="The calculator lived in one analyst’s spreadsheet.">
        <Text>
          A federal efficiency standard put a penalty-and-credit balance on every vehicle sold. The figure that would go to the regulator was produced by a warehouse model, and checked against a spreadsheet one person had built and one person understood. The check worked and nobody else could run it.
        </Text>
        <Text>
          I wrote the spreadsheet down as a specification, then as a test suite: every rule the analyst applied by hand became an assertion that runs against the warehouse and fails loudly when the two disagree. The suite bakes into a notebook on the platform, so it runs where the data is and needs nobody’s laptop.
        </Text>
        <Text>User acceptance ran off the same suite. The test register is generated from it, the daily status update is generated from it, and sign-off pointed at a run.</Text>
        <Text>↳ What stayed behind: the suite, the register it produces, a self-service reporting layer over the verified models, and a handover the support team runs without me.</Text>
      </Section>

      <Section kicker="Someone was the bottleneck · national retailer, dbt on Snowflake" heading="Every change waited on the one engineer who could drop a schema.">
        <Text>
          The platform team had good models and no end-to-end test. To see whether a change worked you rebuilt against live data, and the rebuild needed schemas dropped and recreated, and one engineer held the access to do that. Every pull request queued behind his calendar.
        </Text>
        <Text>
          I refactored the seeds and snapshots so a build could run from committed fixtures. Updating a seed refreshed the whole chain, on anyone’s branch, with nobody’s elevated access. The test that had lived in one person’s permissions became a step in the pipeline.
        </Text>
        <Text>It saved hours per change, and the team stopped waiting on one desk for the work to move.</Text>
        <Text>↳ What stayed behind: the fixture-driven build, the data products it now gates, and a testing framework the team extends without me.</Text>
      </Section>

      <Contact heading="Recognise one of these?">
        <Text>Start with three questions, or describe the problem directly.</Text>
        <Pill href="/start/">Start here →</Pill>
        <Location />
      </Contact>
    </Page>
  );
}
