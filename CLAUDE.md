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
sets headings and body; Berkeley Mono sets labels, tags and navigation. `site/Flow.tsx`
is the case-study process diagram, drawn in markup, which stacks vertically on
a phone. The early-2000s console interface influence stays in the details: the
glowing diamond on the selected menu item and quiz option, the notched button,
and the page transition.

The hero figure is a looping three.js scene of how operational data is
collected in one industry, on a stage of its own under the hero text that
spans the content column at every width: sources on the ground, the collection path, the
systems of record, one failure and its recovery. Each scene is a data file in
`site/scenes/` (zones, nodes with low-poly models built from boxes and
cylinders, links) listed in `site/scenes/index.ts`; mining and electricity
distribution alternate, one per loop. Marker shape encodes role: circle for a
field source, square for an edge device, hexagon for a system of record,
triangle for the reconciled output. A scene depicts an industry and names no
client, site, vendor or figure. `site/meshScene.ts` renders any scene as a pure
function of the scene and the time in seconds, and `site/Mesh.tsx` loads it and
three.js only in the browser. `?scene=<id>&t=<seconds>` pins one frame. On a stage too narrow for the labels
to read, the renderer enlarges link tags and zone labels, staggers the zone
labels, and hides node labels.
Reduced motion gets one still frame, and no WebGL gets nothing. The built output requests nothing
from another host: no remote fonts, scripts, images or analytics.

Images are optional and live in `public/images/`. `site/Plate.tsx` shows a file
when one with the slot's name exists (`.avif`, `.webp`, `.jpg` or `.png`) and
renders nothing when it does not, so a slot is filled by adding a file and
needs no code change. Slots: `hero` (replaces the hero scene),
`work-<slug>`, `capability-<id>`, `sector-<name>` (including
`sector-electricity`), and `studio`. Images are illustration: charcoal, bone
and olive, no text, and never presented as a photograph of a client's site.

`tests/design_check.py` runs against `out/` after a build and enforces the
route count, the no-remote-assets rule, that every image is a file in
`public/images/`, the quiz, the redirect stubs, and that
every listed sector has a case. `node tests/mesh_check.mjs` also runs against
`out/`, in Chrome through `playwright-core`: it captures both hero scenes at
six times into `tests/out/mesh/`, and checks that they draw, that olive appears
only after the fault, that the scenes differ, that the stage spans the content column
on a desktop, that no scene pixel falls inside the headline, lede, tags or
actions at desktop, tablet and phone widths, that no width scrolls sideways,
reduced motion, and the console. With `MESH_REF` set to a reference video it also writes one
comparison image per scene.
