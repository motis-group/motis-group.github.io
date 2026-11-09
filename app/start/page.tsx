import Quiz from '@root/site/Quiz';
import { Page, PageHero, Section } from '@root/site/Site';

export const metadata = { title: 'start | MOTIS.GROUP' };

export default function Start() {
  return (
    <Page active="START">
      <PageHero kicker="Start" heading="Three questions about what you can see day to day." lede="You don’t need to know what is causing it underneath. That part is my job." />
      <Section>
        <Quiz />
      </Section>
    </Page>
  );
}
