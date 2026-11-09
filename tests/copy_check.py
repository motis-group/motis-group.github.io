import collections
import html.parser
import pathlib
import subprocess
import sys

BASELINE = 'c562eac'
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'out'
SKIP = {'script', 'style', 'noscript', 'template'}


class Visible(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.title = ''
        self.words = []

    def handle_starttag(self, tag, attrs):
        if tag not in {'meta', 'link', 'img', 'br', 'input', 'hr', 'source'}:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.stack:
            while self.stack and self.stack.pop() != tag:
                pass

    def handle_data(self, data):
        if 'title' in self.stack:
            self.title += data
        elif 'head' in self.stack or SKIP & set(self.stack):
            return
        else:
            self.words += [w for w in data.split() if any(c.isalnum() for c in w)]


def read(markup):
    parser = Visible()
    parser.feed(markup)
    return ' '.join(parser.title.split()), parser.words


def routes():
    names = subprocess.run(['git', 'ls-tree', '-r', '--name-only', BASELINE], cwd=ROOT, capture_output=True, text=True, check=True).stdout.split()
    return sorted(n for n in names if n.endswith('index.html'))


def main():
    failures = 0
    paths = routes()
    for path in paths:
        old = subprocess.run(['git', 'show', f'{BASELINE}:{path}'], cwd=ROOT, capture_output=True, text=True, check=True).stdout
        built = OUT / path
        if not built.exists():
            print(f'FAIL {path}: not built')
            failures += 1
            continue
        old_title, old_words = read(old)
        new_title, new_words = read(built.read_text())
        missing = collections.Counter(old_words) - collections.Counter(new_words)
        extra = collections.Counter(new_words) - collections.Counter(old_words)
        problems = []
        if old_title != new_title:
            problems.append(f'title {old_title!r} != {new_title!r}')
        if missing:
            problems.append(f'missing {dict(missing)}')
        if extra:
            problems.append(f'extra {dict(extra)}')
        if problems:
            failures += 1
            print(f'FAIL {path}: ' + '; '.join(problems))
        else:
            print(f'ok   {path}: {len(new_words)} words')
    print(f'{len(paths)} routes, {failures} failures')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
