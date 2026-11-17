import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'out'
ROUTES = 33
REMOTE_ASSET = re.compile(r'''<(?:script|link|img|source|video|iframe)[^>]*(?:src|href)=["']https?://|url\(["']?https?://|@import\s+["']?https?://''')
MOVED = {'about': '/studio/', 'projects': '/work/'}


def failures():
    found = []
    pages = sorted(p for p in OUT.rglob('index.html') if p.parts[len(OUT.parts)] not in {'404', '_not-found'})
    if len(pages) != ROUTES:
        found.append(f'{len(pages)} built routes, want {ROUTES}')
    for page in pages:
        html = page.read_text()
        name = page.relative_to(OUT)
        if REMOTE_ASSET.search(html):
            found.append(f'{name} loads a remote asset')
        for src in re.findall(r'<img[^>]*src="([^"]*)"', html):
            if not src.startswith('/images/') or not (OUT / src.lstrip('/')).exists():
                found.append(f'{name} shows {src}: images are files in public/images/')
        if len(re.findall(r'<h1', html)) > 1:
            found.append(f'{name} has more than one h1')
    for css in OUT.rglob('*.css'):
        if REMOTE_ASSET.search(css.read_text()):
            found.append(f'{css.relative_to(OUT)} loads a remote asset')
    start = (OUT / 'start/index.html').read_text() if (OUT / 'start/index.html').exists() else ''
    if len(re.findall(r'type="radio"', start)) != 14 or 'Answer all three to continue' not in start:
        found.append('start/ does not render 14 radio options and the disabled continue button')
    for old, new in MOVED.items():
        stub = (OUT / old / 'index.html').read_text() if (OUT / old / 'index.html').exists() else ''
        if f'url={new}' not in stub:
            found.append(f'{old}/ does not redirect to {new}')
    work = (ROOT / 'site/work.ts').read_text()
    listed = set(re.findall(r"sector: '([A-Za-z]+)'", work))
    declared = set(re.findall(r"'([A-Za-z]+)'", re.search(r'SECTORS = \[([^\]]*)\]', work).group(1)))
    if listed != declared:
        found.append(f'sectors listed {sorted(declared)} do not match sectors with a case {sorted(listed)}')
    return found


if __name__ == '__main__':
    problems = failures()
    for p in problems:
        print('FAILED', p)
    print(f'{len(problems)} failures')
    sys.exit(1 if problems else 0)
