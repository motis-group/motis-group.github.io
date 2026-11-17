motis.group: the commercial site of Motis, an independent systems engineering
studio in Melbourne. William Marzella is its founder and principal engineer,
and the only person in it. The site sells competence and delivery: what Motis
builds, the case studies that show it, and how to start. Personal writing and
worldview belong on a separate personal site.

Voice: "Motis" names the studio and "I" does the work. Never "we", because
there is one person. The headline claim is systems for operations where a
wrong number costs something. The offer underneath: a read, then a fixed-price
build handed over, no retainer.

Claims need proof. `site/work.ts` holds the case studies, all anonymised, and a
figure appears only where it was measured. `SECTORS` lists a sector only when a
case carries it, and the design check enforces that. Electricity distribution
is the focus with no delivered engagement, and `/industries/` says so. Agent
evaluation is offered with no client case, and `/capabilities/` says so.

Pages: `/` (hero, one case's figures, capabilities, three cases, the approach,
why now), `/capabilities/` (six capabilities from `site/capabilities.ts`, what
a model does not solve, delivery terms, stack), `/work/` and `/work/<slug>/`
(context, problem, architecture, a before-and-after flow, implementation,
outcome, technical details), `/industries/`, `/studio/` (principal, philosophy,
the ten-stage method, principles), and `/contact/`. `/start/` is a
three-question quiz that routes to twelve destination pages; the leaf copy
lives in `site/leaves.ts`, and `site/LeafProse.tsx` inserts personalised
paragraphs before the paragraph containing "read-only access". `/about/`,
`/projects/` and each `/start/<trigger>/` are redirect stubs.

Next.js static export: `npm ci && npm run build` writes `out/`, and
`.github/workflows/pages.yml` deploys `out/` to GitHub Pages on a push to
`main`. `trailingSlash` keeps every route at `/work/`-style paths. `public/`
holds what is served as-is: favicon, `CNAME`, `.nojekyll`, and the Berkeley
Mono font file.

Design: one dark theme in `site.css`. Charcoal ground, bone text, olive as the
only accent, hairline rules. Archivo (self-hosted through `@fontsource-variable`)
sets headings and body; Berkeley Mono sets labels, tags and navigation. Figures
are drawn in markup: `site/Field.tsx` is the hero's isometric column field and
`site/Flow.tsx` is the case-study process diagram, which stacks vertically on a
phone. The early-2000s console interface influence stays in the details: the
glowing diamond on the selected menu item and quiz option, the column field,
the notched button, and the page transition. Do not add stock photography or
any image a client did not supply. The built output requests nothing from
another host: no remote fonts, scripts, images or analytics.

`tests/design_check.py` runs against `out/` after a build and enforces the
route count, the no-remote-assets rule, the quiz, the redirect stubs, and that
every listed sector has a case.
