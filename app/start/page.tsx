import Quiz from '@root/site/Quiz';
import { Band, Page, PageHead } from '@root/site/ui';

export const metadata = { title: 'Start | Motis' };

export default function Start() {
  return (
    <Page active="Contact">
      <PageHead label="Start" heading="Three questions about what you can see day to day." lede="You don’t need to know what is causing it underneath. That part is my job." />
      <Band>
        <Quiz />
      </Band>
    </Page>
  );
}
