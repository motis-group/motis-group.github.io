motis.group: an AI-powered agency for data engineering, business intelligence,
and analytics. Agents deployed in the client's cloud account do the
maintenance — diagnose, fix, verify, open a PR — and a senior engineer reviews
every material change. Asset-heavy operators are the focus. Electricity
distribution is the target vertical, with no delivered engagement yet, so the
copy calls it where I'm concentrating and lets mining and automotive carry
proof. Every sector the site lists needs a case on `projects/`.

Pages: `app/page.tsx` is the landing page (full-bleed hero, stat band,
service cards, inverted method band, industries, the four buying moments, and
a contact band that names the trading entity). `app/start/` is a
three-question quiz that routes visitors to ten destination pages; the leaf
copy lives in `site/leaves.ts`, rendered by `app/start/[trigger]/[sub]/`, and
each `/start/<trigger>/` is a stub that redirects to `/start/`.
`app/projects/` is four anonymised engagement write-ups. `app/about/` is the
long-form first-person pitch.

Next.js static export: `npm ci && npm run build` writes `out/`, and
`.github/workflows/pages.yml` deploys `out/` to GitHub Pages on a push to
`main`. `trailingSlash` keeps every route at `/about/`-style paths. `public/`
holds what is served as-is: favicon, `images/`, `CNAME`, `.nojekyll`, and the
Berkeley Mono font file.

Every page is built from SRCL components (sacred.computer, MIT,
`SRCL-LICENSE.md`), vendored unchanged into `components/`, `common/` and
`global.css`. Vendor a new component with its transitive imports; never edit
a vendored file. The site's own layer is `site/` (shared page sections in
`Chrome.tsx`, client components for the quiz, leaf personalisation and theme
toggle) and `site.css`, which sets the palette and Berkeley Mono through SRCL's
`--theme-*` and `--font-family-mono` tokens for `body.theme-light` and
`body.theme-dark`, and lays sections out by `data-layout` attribute. The only
non-SRCL elements are `<img>` (logos and dithered backgrounds), inline links
inside copy, and the quiz's own anchors. The built output requests nothing
from another host: no remote fonts, scripts or analytics.

Landing imagery is dithered — single-colour dots on transparency, rendered
with `image-rendering: pixelated`. The three full-bleed backgrounds are
Unsplash photos (Unsplash License) run through
`scripts/dither.sh input output [hex] [ordered|fs]` (ImageMagick, local-only:
`scripts/` is gitignored), after
`magick -resize 720x -colorspace Gray -normalize -level 12%,88%`. Sources:

- `dither-tower.png` — images.unsplash.com/photo-1761458679955-248cbcb87745
- `dither-racks.png` — images.unsplash.com/photo-1695668548342-c0c1ad479aee
- `dither-wires.png` — images.unsplash.com/photo-1780766824485-b43c751ae6b4

All copy speaks in the first person singular. The quiz routes off
`a.opt[data-q][data-v]` and `#go` (`site/Quiz.tsx`); the leaf pages'
personalisation (`site/LeafProse.tsx`) inserts paragraphs into `#prose` before
the paragraph containing "read-only access" — keep those hooks when editing.
