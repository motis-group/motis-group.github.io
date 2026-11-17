import fs from 'node:fs';
import path from 'node:path';

const FORMATS = ['avif', 'webp', 'jpg', 'jpeg', 'png'];

export function plate(name: string): string | null {
  const dir = path.join(process.cwd(), 'public', 'images');
  const ext = FORMATS.find((e) => fs.existsSync(path.join(dir, `${name}.${e}`)));
  return ext ? `/images/${name}.${ext}` : null;
}

export default function Plate({ name, shape = 'wide', eager }: { name: string; shape?: 'wide' | 'tile' | 'hero'; eager?: boolean }) {
  const src = plate(name);
  if (!src) return null;
  return (
    <figure className={`plate ${shape}`}>
      <img src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  );
}
