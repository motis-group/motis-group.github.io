export interface Capability {
  id: string;
  name: string;
  short: string;
  solves: string;
  builds: string[];
  proof?: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'architecture',
    name: 'Systems architecture',
    short: 'One coherent shape for systems that grew apart.',
    solves: 'Several systems describe the same asset, customer or order, and they disagree. Nobody can say which one is the record, so people reconcile them by hand before every meeting.',
    builds: [
      'A map of what exists: systems of record, sources of truth, the flows and hand-offs between them, and who owns each',
      'The boundaries, interfaces and canonical model that let the systems agree',
      'Failure handling and ownership decided before anything is built',
    ],
  },
  {
    id: 'automation',
    name: 'Workflow automation',
    short: 'The manual step, written as code that checks itself.',
    solves: 'A person remembers a step, runs it by hand, and catches the errors by noticing. It works until that person is on leave, has left, or is wrong.',
    builds: [
      'The rule written down in a form software enforces',
      'Deterministic jobs on a schedule or a trigger, with nothing left to memory',
      'Checks that fail loudly, so the exception reaches somebody without them going looking',
    ],
  },
  {
    id: 'ai',
    name: 'Applied AI',
    short: 'A model inside a workflow, with code on both sides of it.',
    solves: 'Knowledge-heavy work waits on the few people who can do it, or an AI agent is already answering questions and nobody can say how often it is right.',
    builds: [
      'A model placed between deterministic steps: code gathers, the model judges or drafts, code acts, and a person approves anything material',
      'Definitions written where the agent reads them, so it answers from what the business agreed',
      'A set of questions with known answers, run on every change, so the agent has a pass rate',
    ],
    proof: 'Motis runs its own back office on this pattern. Testing an agent against signed figures is offered and has no client case study yet, so none is shown.',
  },
  {
    id: 'data',
    name: 'Data engineering',
    short: 'Platforms and pipelines whose numbers can be defended.',
    solves: 'Reports disagree, pipelines fail overnight, and nobody can trace a figure from the dashboard back to the system it came from.',
    builds: [
      'Pipelines, models and infrastructure on the platform you already run',
      'Tests and lineage from the first model, including tests on the readers of a model',
      'One definition per metric, with its grain, unit, roll-up rule and owner',
    ],
  },
  {
    id: 'integration',
    name: 'API integration',
    short: 'Applications that pass work to each other without retyping.',
    solves: 'The same record is typed into two or three applications. Each copy drifts, and the differences surface as a wrong invoice or a missed order.',
    builds: [
      'Integrations with a stated contract on each side',
      'Syncs that can be run twice safely',
      'A reconciliation that counts both sides and reports what does not match',
    ],
  },
  {
    id: 'advisory',
    name: 'Technical advisory',
    short: 'A written answer to an architecture or platform question.',
    solves: 'A decision is due on a platform, a capacity purchase or a build, and the evidence for it is a vendor’s slide.',
    builds: [
      'A read of the system as it runs, from its own logs and history',
      'A written finding you can put in front of somebody else',
      'A recommendation with the cheaper options listed first',
    ],
  },
];

export const STACK = 'Python · SQL · AWS · Snowflake · Microsoft Fabric · dbt · Airflow · Terraform · PostgreSQL · APIs · LLMs';

export const UNSOLVED: [string, string][] = [
  [
    'One word, three meanings',
    'The same metric name means different things at different sites, because each site records on a different system. An agent reading the warehouse finds the name and no trace of what was agreed.',
  ],
  [
    'Nobody can say how often the agent is right',
    'A wrong dashboard is wrong the same way every day until somebody notices. An agent writes a new query for each question, so its errors do not repeat in one place.',
  ],
  ['A rate added up like a total', 'Ask for a utilisation rate over a week and an agent with no roll-up rule adds seven daily rates together. How a number adds up is part of what it means.'],
  ['The rule lives in one person', 'Somebody knows which reading looks wrong in March for a reason. None of it is in the data, so a model cannot learn it from the data.'],
  ['Nobody has signed the number', 'A figure that goes to a board or a regulator needs a person who will answer for it. A model cannot be that person.'],
  ['Queries nobody budgeted', 'Asking is free for the person asking and billed to the warehouse. Agents multiply the queries, and the bill arrives as a total with no cause attached.'],
];

export const RINGS: [string, string][] = [
  ['The core', 'The few numbers the operation runs on, and every number that leaves the building. Each has one definition, an owner, tests, and a signed figure to check against.'],
  ['What teams rely on', 'The reports and metrics built on the core, generated from the same definitions. A break gets fixed fast.'],
  ['Everything else', 'Ad hoc questions and whatever anyone builds on top. They get a sound foundation and no promise.'],
];
