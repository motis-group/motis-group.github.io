export type NodeKind = 'system' | 'person' | 'check' | 'output';

export interface FlowNode {
  kind: NodeKind;
  label: string;
  note?: string;
}

export interface Case {
  slug: string;
  sector: 'Mining' | 'Automotive' | 'Retail' | 'Manufacturing';
  client: string;
  title: string;
  summary: string;
  tags: string[];
  capabilities: string[];
  status: string;
  context: string[];
  problem: string[];
  architecture: string[];
  implementation: string[];
  outcome: string[];
  figures?: [string, string][];
  technical: [string, string][];
  before: FlowNode[];
  after: FlowNode[];
}

export const CASES: Case[] = [
  {
    slug: 'compute-attribution',
    sector: 'Automotive',
    client: 'National automotive distributor',
    title: '842 hours of new compute, and no capacity bought',
    summary: 'An ERP go-live sent an analytics platform running hot. The question on the table was how much capacity to buy. The answer was a schedule.',
    tags: ['Technical advisory', 'Microsoft Fabric', 'Cost'],
    capabilities: ['Technical advisory', 'Systems architecture'],
    status: 'Delivered',
    context: [
      'A national distributor runs its reporting on Microsoft Fabric. A new ERP went live, and the analytics platform behind it started running hot the same week.',
    ],
    problem: [
      'The question on the table was how much more capacity to buy. Nobody could say which workloads were using what, because model rebuilds, batch loads and report queries all shared one lane and collided freely.',
    ],
    architecture: [
      'I treated it as an attribution problem before a sizing problem. Every hour of compute for the week either side of the go-live was assigned to a workload and an owner, per environment, so development and test could be read separately.',
      'The target shape was three lanes: builds, loads and reports, each with its own schedule, and an approval step before a new scheduled model joins a lane.',
    ],
    implementation: [
      'I read the query history for both weeks and wrote the attribution queries against it. One family of models accounted for more than a third of the increase in development. In test the driver was reporting reruns, so the two environments needed different fixes.',
      'The recommendation was operational: separate the lanes, freeze new scheduled models until approved, and break up the worst overlap windows. Buying capacity stayed on the list as a fallback.',
    ],
    outcome: ['Development compute had risen 842 hours in one week. 81% of it was scheduled rebuilds colliding. The fix was lanes and schedules, and no capacity upgrade was needed.'],
    figures: [
      ['842 h', 'dev compute added in one week'],
      ['81%', 'of it scheduled rebuilds colliding'],
      ['0', 'capacity upgrades needed'],
    ],
    technical: [
      ['Platform', 'Microsoft Fabric warehouse and capacity metrics'],
      ['Method', 'Query-history attribution by workload, owner and environment'],
      ['Handed over', 'The attribution queries as a playbook anyone on the team can rerun, and a runbook for the next time the numbers creep'],
    ],
    before: [
      { kind: 'system', label: 'ERP go-live' },
      { kind: 'system', label: 'One shared lane', note: 'builds, loads and reports collide' },
      { kind: 'person', label: 'Capacity owner', note: 'sees a total, no cause' },
      { kind: 'output', label: 'Buy more capacity?' },
    ],
    after: [
      { kind: 'system', label: 'Query history' },
      { kind: 'check', label: 'Attribution', note: 'hours by workload and owner' },
      { kind: 'system', label: 'Three lanes', note: 'builds · loads · reports' },
      { kind: 'output', label: 'Same capacity' },
    ],
  },
  {
    slug: 'regulatory-test-suite',
    sector: 'Automotive',
    client: 'Australian automotive distributor',
    title: 'One analyst’s spreadsheet, rewritten as a test suite',
    summary: 'A federal efficiency standard put a penalty-and-credit balance on every vehicle sold. The only check on the figure lived in a spreadsheet one person understood.',
    tags: ['Workflow automation', 'Regulatory reporting', 'Microsoft Fabric'],
    capabilities: ['Workflow automation', 'Data engineering'],
    status: 'Delivered',
    context: [
      'A federal efficiency standard put a penalty-and-credit balance on every vehicle the distributor sold. The figure that goes to the regulator comes from a warehouse model.',
    ],
    problem: [
      'That figure was checked against a spreadsheet one analyst had built and one analyst understood. The check worked, and nobody else could run it. A regulator would be the next to find out if it stopped.',
    ],
    architecture: [
      'The spreadsheet became a written specification first, so the rules could be argued about in words. Each rule in the specification then became an assertion against the warehouse.',
      'The suite runs where the data is, in a notebook on the platform, so it needs nobody’s laptop. The test register and the daily status update are generated from the suite, so the paperwork cannot drift from the tests.',
    ],
    implementation: [
      'I sat with the analyst and wrote down every rule applied by hand. Each one became a test that fails loudly when the warehouse and the rule disagree.',
      'User acceptance ran off the same suite, and sign-off pointed at a run.',
    ],
    outcome: ['The check no longer depends on one person or one file. The support team runs the suite without me, and a self-service reporting layer sits over the verified models.'],
    technical: [
      ['Platform', 'Microsoft Fabric warehouse and notebooks'],
      ['Tests', 'Rule-per-assertion suite generated from a written specification'],
      ['Handed over', 'The suite, the register it produces, the reporting layer, and a handover the support team runs'],
    ],
    before: [
      { kind: 'system', label: 'Warehouse model' },
      { kind: 'person', label: 'One analyst', note: 'checks against a private spreadsheet' },
      { kind: 'output', label: 'Figure to regulator' },
    ],
    after: [
      { kind: 'system', label: 'Warehouse model' },
      { kind: 'check', label: 'Test suite', note: 'one assertion per rule' },
      { kind: 'system', label: 'Generated register', note: 'and daily status' },
      { kind: 'output', label: 'Figure to regulator', note: 'sign-off points at a run' },
    ],
  },
  {
    slug: 'downstream-tests',
    sector: 'Mining',
    client: 'Australian miner',
    title: 'The release failed in test, where it was supposed to',
    summary: 'A production accounting model gained quarterly figures. A test on a board that reads the same tables caught the change before production did.',
    tags: ['Data engineering', 'dbt', 'Snowflake'],
    capabilities: ['Data engineering', 'Systems architecture'],
    status: 'Ongoing',
    context: ['A miner runs production accounting on dbt and Snowflake. A weekly performance board reads the same tables as the accounting models.'],
    problem: [
      'An accounting model was gaining quarterly figures beside its monthly ones. A change like that is correct where it is made and can still break every reader downstream that assumed monthly.',
    ],
    architecture: [
      'Tests sit on the readers of a model as well as on the model that changed. The board declares the time grains it expects to see, so a new grain upstream fails the board’s own run.',
      'Every release takes the same path: deployed to test, validated there, and only then raised as a production change, copied from the last one that went through clean.',
    ],
    implementation: [
      'When the accounting release reached the test environment, the board’s run failed its grain test. The new grains were correct, so the fix was to widen the board’s list on the sources it reads and ship both changes in one release.',
    ],
    outcome: ['Nothing reached production. The reader and the model shipped together.'],
    technical: [
      ['Stack', 'dbt on Snowflake, with separate test and production environments'],
      ['Tests', 'Accepted-grain tests on downstream readers'],
      ['Stays behind', 'The release steps written down, and tests on the readers of a model'],
    ],
    before: [
      { kind: 'system', label: 'Accounting model', note: 'gains a quarterly grain' },
      { kind: 'system', label: 'Performance board', note: 'assumes monthly' },
      { kind: 'output', label: 'Wrong totals in production' },
    ],
    after: [
      { kind: 'system', label: 'Accounting model', note: 'gains a quarterly grain' },
      { kind: 'check', label: 'Board’s grain test', note: 'fails in the test environment' },
      { kind: 'system', label: 'One release', note: 'model and reader together' },
      { kind: 'output', label: 'Production unchanged until ready' },
    ],
  },
  {
    slug: 'fixture-builds',
    sector: 'Retail',
    client: 'National retailer',
    title: 'Every change waited on one engineer’s access',
    summary: 'A platform team had good models and no end-to-end test. Seeing whether a change worked needed schemas dropped by the one person allowed to drop them.',
    tags: ['Data engineering', 'dbt', 'Snowflake'],
    capabilities: ['Data engineering', 'Workflow automation'],
    status: 'Delivered',
    context: ['A national retailer’s platform team builds its data products with dbt on Snowflake.'],
    problem: [
      'To see whether a change worked you rebuilt against live data. The rebuild needed schemas dropped and recreated, and one engineer held the access to do that. Every pull request queued behind his calendar.',
    ],
    architecture: [
      'A build should run from what is committed. Seeds and snapshots were reshaped so the whole chain rebuilds from fixtures in the repository, on anyone’s branch, with nobody’s elevated access.',
    ],
    implementation: [
      'I refactored the seeds and snapshots so that updating a seed refreshes the chain. The test that had lived in one person’s permissions became a step in the pipeline.',
    ],
    outcome: ['It saved hours per change, and the team stopped waiting on one desk for work to move.'],
    technical: [
      ['Stack', 'dbt on Snowflake'],
      ['Tests', 'Fixture-driven end-to-end build in the pipeline'],
      ['Handed over', 'The build, the data products it gates, and a testing framework the team extends'],
    ],
    before: [
      { kind: 'system', label: 'Pull request' },
      { kind: 'person', label: 'One engineer', note: 'holds the access to drop schemas' },
      { kind: 'system', label: 'Rebuild on live data' },
      { kind: 'output', label: 'Change verified, eventually' },
    ],
    after: [
      { kind: 'system', label: 'Pull request' },
      { kind: 'check', label: 'Fixture build', note: 'runs on any branch' },
      { kind: 'output', label: 'Change verified in the pipeline' },
    ],
  },
  {
    slug: 'quote-to-order',
    sector: 'Manufacturing',
    client: 'Glass, door and window manufacturer',
    title: 'A quote drawn, priced and turned into an order in one place',
    summary: 'A manufacturer prices glass by its shape and finish. The pricing rules now live in software that draws the piece, prices it, prints the quote and raises the order.',
    tags: ['Workflow automation', 'API integration', 'Web application'],
    capabilities: ['Workflow automation', 'API integration'],
    status: 'In use, extended in small increments',
    context: ['A manufacturer makes glass, doors and windows to order. Every job is a different shape, and the price depends on the shape and on what is done to it.'],
    problem: [
      'A price depends on height, width and perimeter, on glass thickness and colour, and on finishing such as polished edges, ceramic bands and holes. A quote then has to become an order without anybody typing it a second time.',
    ],
    architecture: [
      'The pricing rules are code, so the same inputs always give the same price. The drawing is the input: the shape on screen produces the dimensions the rules read.',
      'A quote is one record from first drawing to order. Glass, window and awning lines sit on the same quote, and the customer list comes from the accounting system so it is kept in one place.',
    ],
    implementation: [
      'I built a browser application where the piece is drawn as a polygon and its height, width and perimeter are measured from the drawing. Thickness, colour and finishing options feed the price.',
      'It prints the customer quote, converts an accepted quote into an order, and imports customers from the accounting system.',
    ],
    outcome: ['The pricing rules are written down in one place and applied the same way on every quote. The manufacturer keeps extending it a few hours at a time.'],
    technical: [
      ['Stack', 'React, TypeScript, Tailwind CSS'],
      ['Integration', 'Customer import from the accounting system'],
      ['Scope', 'Drawing and pricing, printed quotes, multi-line quotes, quote-to-order'],
    ],
    before: [
      { kind: 'person', label: 'Estimator', note: 'holds the pricing rules' },
      { kind: 'output', label: 'Quote' },
      { kind: 'person', label: 'Re-entry', note: 'quote typed again as an order' },
      { kind: 'output', label: 'Order' },
    ],
    after: [
      { kind: 'system', label: 'Drawing', note: 'height · width · perimeter' },
      { kind: 'check', label: 'Pricing rules', note: 'in code' },
      { kind: 'output', label: 'Printed quote' },
      { kind: 'output', label: 'Order', note: 'converted, never retyped' },
    ],
  },
  {
    slug: 'store-data-model',
    sector: 'Retail',
    client: 'Online specialist retailer',
    title: 'One product template, and a check that notices drift',
    summary: 'An online store had grown its product data one product at a time. A fixed-price engagement gave it one data model, one template, and a weekly check.',
    tags: ['Systems architecture', 'Workflow automation', 'E-commerce'],
    capabilities: ['Systems architecture', 'Workflow automation'],
    status: 'Fixed price',
    context: ['An online retailer of specialist sports gear runs its own store. The engagement began with a cold read of the store, done before any conversation about price.'],
    problem: [
      'Products had been added over years, each a little differently, so the storefront templates had to cope with every variation. Keeping products consistent was a job somebody did by looking.',
    ],
    architecture: [
      'One data model that every product conforms to, and one product template that reads from it. The boundary is explicit: the store’s developer owns the templates, and I own what the templates read from.',
      'A weekly drift check compares the catalogue with the model and reports what no longer conforms.',
    ],
    implementation: ['The scope is the data model, the single template every product lands on, the weekly drift check, and short recorded walkthroughs for the routine jobs.'],
    outcome: [
      'The work is fixed price and ends in a handover. A monthly managed option was priced beside it and neither side took it, because becoming the monthly solution is the work worth building away.',
    ],
    technical: [
      ['Platform', 'Shopify'],
      ['Check', 'Weekly drift report of products against the data model'],
      ['Handed over', 'The model, the check, and recorded walkthroughs for routine jobs'],
    ],
    before: [
      { kind: 'system', label: 'Products', note: 'each entered a little differently' },
      { kind: 'person', label: 'Somebody looking', note: 'keeps them consistent' },
      { kind: 'output', label: 'Storefront' },
    ],
    after: [
      { kind: 'system', label: 'Data model' },
      { kind: 'system', label: 'One template' },
      { kind: 'check', label: 'Weekly drift check' },
      { kind: 'output', label: 'Storefront' },
    ],
  },
];

export const SECTORS = ['Mining', 'Automotive', 'Retail', 'Manufacturing'] as const;

export function casesFor(capability: string): Case[] {
  return CASES.filter((c) => c.capabilities.includes(capability));
}
