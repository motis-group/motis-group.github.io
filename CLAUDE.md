motis.group: AI engineering for mining and energy. The work is writing an
operation down in a form software can check, building the data under it, and
leaving agents that run it on the client's own systems. Deterministic at the
edges, judgment in the middle, a named person signing every material change.

One page. `index.html` is the whole site, laid out on the varickagents.com
pattern: sticky nav, a hero with a canvas dot terrain and two CTA blocks, a
name strip, the thesis, four step cards, the method band, a second name strip,
the navy sectors band, the no-migration band, three sticky agent cards,
selected work, the quote band, the enquiry form, the FAQ, and a footer that
opens with two CTA cards. The layout follows that site; the copy is original
and must stay so. There are no subpages; an inbound link to `/start`,
`/projects` or `/about` 404s.

Static, no build step. Switzer from the Fontshare CDN for text, Berkeley Mono
for mono labels. Light only. Every colour goes through the CSS variables at the
top of `styles.css`.

The enquiry form has no backend: Continue opens a pre-filled `mailto:` to
hello@motis.group. Headings marked `data-split` fade in word by word; without
JS they render as plain text.

Imagery is dithered: dots on transparency, used as CSS masks so one PNG takes
any tint (`.img-tower`, `.img-racks`, `.img-wires`; set `--tint` and
`--tint-opacity` on the block). The three sources are Unsplash photos
(Unsplash License) run through
`scripts/dither.sh input output [hex] [ordered|fs]` (ImageMagick, local-only:
`scripts/` is gitignored), after
`magick -resize 720x -colorspace Gray -normalize -level 12%,88%`:

- `dither-tower.png` — images.unsplash.com/photo-1761458679955-248cbcb87745
- `dither-racks.png` — images.unsplash.com/photo-1695668548342-c0c1ad479aee
- `dither-wires.png` — images.unsplash.com/photo-1780766824485-b43c751ae6b4

All copy speaks in the first person singular. Claims stay inside the delivery
record: mining and adjacent asset-heavy operations are delivered work; energy
networks are the direction, and the FAQ says so.

Preview with the `stygian-site` config in `.claude/launch.json`. The page uses
absolute paths, so `file://` will not resolve the stylesheet.
