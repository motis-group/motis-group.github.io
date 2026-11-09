motis.group: an AI-powered agency for data engineering, business intelligence,
and analytics. Agents deployed in the client's cloud account do the
maintenance — diagnose, fix, verify, open a PR — and a senior engineer reviews
every material change. Asset-heavy operators are the focus. Electricity
distribution is the target vertical, with no delivered engagement yet, so the
copy calls it where I'm concentrating and lets mining and automotive carry
proof. Every sector the site lists needs a case on `projects/`.

Pages: `app/page.tsx` is the landing page (hero, stats table, services,
method, industries, the four buying moments, and a contact card that names the
trading entity). `app/start/` is a three-question quiz that routes visitors to
ten destination pages; the leaf copy lives in `site/leaves.ts`, rendered by
`app/start/[trigger]/[sub]/`, and each `/start/<trigger>/` is a stub that
redirects to `/start/`. `app/projects/` is four anonymised engagement
write-ups. `app/about/` is the long-form first-person pitch.

Next.js static export: `npm ci && npm run build` writes `out/`, and
`.github/workflows/pages.yml` deploys `out/` to GitHub Pages on a push to
`main`. The repository's Pages source is GitHub Actions, so nothing deploys
without that workflow. `trailingSlash` keeps every route at `/about/`-style
paths. `public/` holds what is served as-is: favicon, `CNAME`, `.nojekyll`, and
the Berkeley Mono font file.

The design is SRCL's own (sacred.computer, MIT, `SRCL-LICENSE.md`): its stock
`theme-light` and `theme-dark`, its page frame (`page/DefaultLayout`,
`Navigation`), and content as `Grid` and `Card`, with `Table`, `Accordion`,
`ListItem`, `RadioButton` and `Button` inside. Components are vendored
unchanged into `components/`, `common/` and `global.css`; vendor a new one with
its transitive imports and never edit a vendored file. Do not restyle SRCL to
look like something else: `site.css` holds only the Berkeley Mono font rule,
and a page that needs a new look uses a different SRCL component. `site/Site.tsx`
composes the shared sections; a card title longer than 26 characters overflows
a 375px screen, so `Panel` renders it as a `Badge` instead. The built output
requests nothing from another host: no remote fonts, scripts or analytics.

All copy speaks in the first person singular. The quiz (`site/Quiz.tsx`)
builds `/start/<trigger>/<sub>/?catches=…&notices=…` from three radio groups;
the leaf pages' personalisation (`site/LeafProse.tsx`) inserts paragraphs into
`#prose` before the paragraph containing "read-only access".

Two checks guard the site, both run against `out/` after a build:
`tests/copy_check.py` compares every route's title and words with the
pre-port HTML at commit c562eac, and `tests/design_check.py` enforces the rules
above.
