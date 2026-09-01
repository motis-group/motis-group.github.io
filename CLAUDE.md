motis.group: an AI-powered agency for data engineering, business intelligence,
and analytics. Agents deployed in the client's cloud account do the
maintenance — diagnose, fix, verify, open a PR — and a senior engineer reviews
every material change. Asset-heavy operators are the focus; electricity
distribution is the flagship vertical.

Pages: `index.html` is the landing page (Geminus-style: full-bleed hero, stat
band, service cards, inverted method band, industries). `start/` is a
three-question quiz that routes visitors to eight destination pages.
`projects/` lists work from a static array in `projects.js` (`rows.js` pads
short ruled tables down to the fixed footer). `about/` is the long-form
first-person pitch.

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

Gotcha: the landing copy speaks as "we"; `about/` and the `start/` pages speak
as "I". Pick one before adding new copy.
