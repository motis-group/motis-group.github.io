motis.group: an AI-powered agency for data engineering, business intelligence,
and analytics. Agents deployed in the client's cloud account do the
maintenance — diagnose, fix, verify, open a PR — and a senior engineer reviews
every material change. Asset-heavy operators are the focus; electricity
distribution is the flagship vertical.

Pages: `index.html` is the landing page (Geminus-style: full-bleed hero, stat
band, service cards, inverted method band, industries). `start/` is a
three-question quiz that routes visitors to ten destination pages.
`projects/` is three anonymised engagement write-ups, each a `.lp-section`
with prose and a closing `.lp-deliverable` line. `about/` is the long-form
first-person pitch. `rows.js` pads the ruled tables on the quiz's redirect
stubs down to the fixed footer.

Static site, no build step. Berkeley Mono is the only typeface. Light and dark
themes via `data-theme` on `<html>` (`theme.js`); every colour goes through the
CSS variables at the top of `styles.css`. The landing page's `.lp-*` layer
sits on the shared base styles the other pages use.

Landing imagery is dithered — single-colour dots on transparency, rendered
with `image-rendering: pixelated`. The three full-bleed backgrounds are
Unsplash photos (Unsplash License) run through
`scripts/dither.sh input output [hex] [ordered|fs]` (ImageMagick, local-only:
`scripts/` is gitignored), after
`magick -resize 720x -colorspace Gray -normalize -level 12%,88%`. Sources:

- `dither-tower.png` — images.unsplash.com/photo-1761458679955-248cbcb87745
- `dither-racks.png` — images.unsplash.com/photo-1695668548342-c0c1ad479aee
- `dither-wires.png` — images.unsplash.com/photo-1780766824485-b43c751ae6b4

All copy speaks in the first person singular. Every page is built from the
same design system: `.lp-topbar`, a `.lp-pagehero` (kicker, display headline,
lede), `.lp-section` blocks with prose or `.lp-card` grids, an inverted
`.lp-method` band where a page needs one, and a `.lp-contact` CTA band with a
dithered background. The only tables left are the quiz redirect stubs. The quiz's
routing script hangs off `a.opt[data-q][data-v]` and `#go`; the leaf pages'
personalisation scripts insert paragraphs into `#prose` before the paragraph
containing "read-only access" — keep those hooks when editing.
