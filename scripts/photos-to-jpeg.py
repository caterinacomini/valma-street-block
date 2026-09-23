#!/usr/bin/env python3
"""
Converts the photographs in public/content from PNG to JPEG.

They arrived as PNGs, which is the wrong container for a photograph: PNG is
lossless, so it stores every grain of sensor noise at full price. Seven of them
came to 12 MB where the same pictures as JPEG are 1.4 MB.

Nobody visiting the site was paying for that — Next re-encodes and resizes
every image on the way out, so what reaches a phone is a WebP of about 90 KB
either way. The cost was ours: 12 MB in every clone, and a 2 MB decode each
time Next generates a variant.

Quality 86 because these are photographs shown large: at 80 the gradients in
the sky start to band, and above 90 the file grows without anything to show
for it.

    pip install pillow
    python3 scripts/photos-to-jpeg.py [--dry]

It does not touch the code. Run scripts/photos-to-jpeg.py --refs afterwards, or
grep for the old names: every reference has to move in the same commit, or the
site asks for files that are no longer there.
"""

import argparse
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "..", "public", "content")
QUALITY = 86


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry", action="store_true", help="say what would change")
    args = parser.parse_args()

    pngs = sorted(f for f in os.listdir(CONTENT) if f.lower().endswith(".png"))
    if not pngs:
        print("Nessun PNG da convertire.")
        return 0

    before = after = 0
    for name in pngs:
        src = os.path.join(CONTENT, name)
        dst = src[:-4] + ".jpg"
        size_in = os.path.getsize(src)
        before += size_in

        if args.dry:
            print(f"  {name} → {os.path.basename(dst)}  ({size_in // 1024} KB)")
            continue

        image = Image.open(src)
        # a photograph has no transparency to keep; flatten anything that claims to
        if image.mode in ("RGBA", "LA", "P"):
            flat = Image.new("RGB", image.size, (255, 255, 255))
            rgba = image.convert("RGBA")
            flat.paste(rgba, mask=rgba.split()[-1])
            image = flat
        else:
            image = image.convert("RGB")

        image.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        size_out = os.path.getsize(dst)
        after += size_out
        os.remove(src)
        print(f"  {name:32} {size_in // 1024:5} KB → {size_out // 1024:4} KB"
              f"   ({100 - size_out * 100 // size_in}% in meno)")

    if args.dry:
        print(f"\n--dry: {len(pngs)} file, {before // 1024 // 1024} MB. Niente è stato scritto.")
    else:
        print(f"\n{len(pngs)} file · {before // 1024 // 1024} MB → {after // 1024} KB"
              f"   ({100 - after * 100 // before}% in meno)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
