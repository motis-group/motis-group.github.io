import { Band, Close, Label, Page, PageHead } from '@root/site/ui';
import { CASES, SECTORS } from '@root/site/work';

export const metadata = {
  title: 'Industries | Motis',
  description: 'Mining, automotive, retail and manufacturing, each with the problem the sector keeps producing and the case that shows the work. Electricity distribution is the focus.',
};

const PROBLEM: Record<(typeof SECTORS)[number], string[]> = {
  Mining: [
    'A mine runs on a plan, and every morning somebody argues about the gap between the plan and what happened. Sites bought at different times record on different systems, so one metric name can carry several meanings.',
    'The work is getting a correct number into that room before the argument starts, and making sure a change upstream cannot quietly break the board that reads it.',
  ],
  Automotive: [
    'A distributor reports to a regulator, to a manufacturer and to its own finance team from the same sales and vehicle data. A new standard or a new ERP changes the numbers under all three at once.',
    'The work is turning the checks people run by hand into tests, and reading a platform’s own history before anybody buys more of it.',
  ],
  Retail: [
    'Product, price and stock data is entered by many hands over many years. The platform team that depends on it queues behind whoever holds the access or the memory.',
    'The work is one model that every product conforms to, builds that run from what is committed, and a check that reports drift before a customer sees it.',
  ],
  Manufacturing: [
    'A made-to-order manufacturer prices every job differently, and the pricing rules live with the estimator. The quote is then typed again as an order, and again as an invoice.',
    'The work is the rules written as code, and one record that carries a job from the first drawing to the order.',
  ],
};

export default function Industries() {
  return (
    <Page active="Industries">
      <PageHead label="Industries" heading="Operations with physical consequences." lede="I trained as a mechanical engineer before data, so the work starts from the asset and the operation. I list a sector here only when there is a case to show for it." />

      <Band n="01" label="Sectors with delivered work">
        <div className="rows">
          {SECTORS.map((sector, i) => (
            <div key={sector} id={sector.toLowerCase()} className="row">
              <div>
                <Label n={`0${i + 1}`}>Sector</Label>
                <h2 className="title">{sector}</h2>
              </div>
              <div className="stack">
                <div className="prose">
                  {PROBLEM[sector].map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <ul className="bullets">
                  {CASES.filter((c) => c.sector === sector).map((c) => (
                    <li key={c.slug}>
                      <a href={`/work/${c.slug}/`}>{c.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Band>

      <Band n="02" label="Focus">
        <div className="split">
          <h2 className="headline">Electricity distribution is where I’m concentrating.</h2>
          <div className="prose">
            <p>The assets outlive the systems that describe them, often by decades. The engineer who knows which feeder trips in summer knows it because he was there in summer, and none of that reached the asset register. When a regulator asks a network to justify its spend, the register is what it has to answer with.</p>
            <p>The work the method is built for: operational data verified from SCADA historian to regulatory submission, availability the historian will back, and capital justification the regulator will fund.</p>
            <p className="dim">I have no delivered engagement in electricity distribution yet. The delivered work is in the four sectors above.</p>
          </div>
        </div>
      </Band>

      <Band n="03" label="Other sectors">
        <div className="prose">
          <p>The method carries to any operation with legacy systems, manual checks and an expensive mistake: construction, logistics, agriculture, financial operations. If yours is one of those, the first conversation is a read of your system, and I will say plainly if it is outside what I have done before.</p>
        </div>
      </Band>

      <Close heading="Is your operation on this page?" />
    </Page>
  );
}
