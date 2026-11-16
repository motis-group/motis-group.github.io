motis.group: a one-person data intelligence engineering practice. The argument
the copy makes: agents write the queries, so the scarce work is writing down
what the business means by its numbers where software and agents read it,
proving answers against figures somebody has signed, and answering for the
numbers the operation runs on. The offer is unchanged underneath: a read, then
a fixed-price build handed over, with an agent in the client's account that
drafts fixes for a person to approve. Use "data intelligence engineering" as a
label at most once a page; the body speaks the buyer's words. Asset-heavy
operators are the focus. Electricity distribution is the target vertical, with
no delivered engagement yet, so the copy calls it where I'm concentrating and
lets mining and automotive carry proof. Every sector the site lists needs a
case on `projects/`. Agent evaluation is offered, with no delivered case yet,
so no page claims one.

Pages: `app/page.tsx` is the landing page (hero, stats table, what changed, the six
problems a model leaves unsolved, services, method, the three rings of care,
industries, the five buying moments, and a contact card that names the
trading entity). `app/start/` is a three-question quiz that routes visitors to
twelve destination pages; the leaf copy lives in `site/leaves.ts`, rendered by
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

`tests/design_check.py` guards the site and enforces the rules above. Run it
against `out/` after a build, with `SRCL_DIR` set to the www-sacred components
folder.
