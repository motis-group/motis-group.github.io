import os
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'out'
SRCL = pathlib.Path(os.environ.get('SRCL_DIR', '/Users/marzella/Documents/projects/ventures/cortex/next-ui/vendor/www-sacred/components'))
TITLE_FITS_375 = 26
SITE_FILES = ['site/Site.tsx', 'site/Go.tsx', 'site/ThemeToggle.tsx', 'site/Quiz.tsx', 'site/LeafProse.tsx']
REMOTE_ASSET = re.compile(r'''(?:src|href)=["']https?://(?!blog\.motis\.group|github\.com/motis-group)|url\(["']?https?://|@import\s+["']?https?://''')


def failures():
    found = []
    if not SRCL.is_dir():
        return [f'SRCL source not found at {SRCL}: set SRCL_DIR to the www-sacred components folder']
    css = (ROOT / 'site.css').read_text()
    rules = re.sub(r'@font-face\s*{[^}]*}', '', css)
    rules = re.sub(r'html,\s*body\s*{\s*--font-family-mono:[^;]+;\s*}', '', rules)
    if rules.strip():
        found.append(f'site.css holds more than the font rules: {rules.strip()[:80]!r}')
    for rel in [*SITE_FILES, *(str(p.relative_to(ROOT)) for p in (ROOT / 'app').rglob('*.tsx'))]:
        text = (ROOT / rel).read_text() if (ROOT / rel).exists() else ''
        if not text:
            found.append(f'{rel} missing')
        if 'data-layout' in text or 'data-dither' in text or '<img' in text:
            found.append(f'{rel} uses a custom layout hook or image')
    for rel in SITE_FILES:
        if 'window.location.assign' in ((ROOT / rel).read_text() if (ROOT / rel).exists() else ''):
            found.append(f'{rel} navigates by script instead of a link')
    home = (OUT / 'index.html').read_text() if (OUT / 'index.html').exists() else ''
    if not re.search(r'<a href="/start/"[^>]*>\s*<button', home):
        found.append('index.html "Start here" is not a link')
    quiz = (ROOT / 'site/Quiz.tsx').read_text()
    if 'RadioButton' not in quiz or "className={Utilities" in quiz or 'id="go"' in quiz:
        found.append('site/Quiz.tsx is not built from RadioButton and Button')
    imported = '\n'.join(p.read_text() for p in [*ROOT.glob('app/**/*.tsx'), *ROOT.glob('site/*.tsx'), *ROOT.glob('components/**/*.tsx')])
    for comp in (ROOT / 'components').rglob('*'):
        if comp.is_dir():
            continue
        rel = comp.relative_to(ROOT / 'components')
        source = SRCL / rel
        if not source.exists() or source.read_bytes() != comp.read_bytes():
            found.append(f'components/{rel} differs from SRCL')
        if comp.suffix == '.tsx' and f"@components/{rel.with_suffix('')}'" not in imported:
            found.append(f'components/{rel} is vendored but not imported')
    if (ROOT / 'public/images').exists():
        found.append('public/images still exists')
    pages = sorted(p for p in OUT.rglob('index.html') if p.parts[len(OUT.parts)] not in {'404', '_not-found'})
    if len(pages) != 19:
        found.append(f'{len(pages)} built routes, want 19')
    for page in pages:
        html = page.read_text()
        name = page.relative_to(OUT)
        if 'data-layout' in html:
            found.append(f'{name} has data-layout')
        if len(re.findall(r'<img', html)) != 1:
            found.append(f'{name} has images beyond the DefaultLayout pixel')
        if '☾' not in html:
            found.append(f'{name} has no theme toggle')
        if REMOTE_ASSET.search(html):
            found.append(f'{name} loads a remote asset')
        for title in re.findall(r'<h2 class="Card-module[^"]*title[^"]*">([^<]*)</h2>', html):
            if len(title) > TITLE_FITS_375:
                found.append(f'{name} card title {title!r} is wider than a 375px screen allows')
    start = (OUT / 'start/index.html').read_text() if (OUT / 'start/index.html').exists() else ''
    if len(re.findall(r'type="radio"', start)) != 13 or 'answer all three to continue' not in start:
        found.append('start/ does not render 13 radio options and the disabled continue button')
    return found


if __name__ == '__main__':
    problems = failures()
    for p in problems:
        print('FAILED', p)
    print(f'{len(problems)} failures')
    sys.exit(1 if problems else 0)
