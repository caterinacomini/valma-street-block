#!/usr/bin/env python3
"""
Builds the blurred companion to the hero photograph.

The hero carried a progressive blur made of four stacked backdrop-filter
layers. Measured on the published site, that was the only thing on the page
dropping frames: fifty milliseconds a frame while the hero was on screen —
about twenty a second — against a flat seventeen everywhere else.

The cost is the blur itself, not how it is applied. Four layers, one layer,
backdrop-filter or a plain filter on a copy, promoted to its own compositor
layer or not: measured, all of them drop the same frames. A photograph that
arrives already blurred costs nothing, because by then it is just a picture.

So the blur happens here, once, instead of sixty times a second on someone's
phone.

Radius 10 at 1600px wide reproduces the 9px CSS blur the top layer had at a
1440px viewport. It does not need to be sharper than that: it is the blurred
copy, and a blurred image compresses to almost nothing.

    pip install pillow
    python3 scripts/build-hero-blur.py [--src FILE]

Run it again if the hero photograph changes, or the blurred layer will be of
the wrong picture — which is the one thing this approach can get wrong, and is
why the component skips the layer when the file is missing rather than
showing the wrong photograph softly.
"""

import argparse
import os
import sys

from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "..", "public", "content")

WIDTH = 1600
RADIUS = 10


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", default="urban-climbing-bridge-dyno.jpg")
    args = parser.parse_args()

    src = os.path.join(CONTENT, args.src)
    if not os.path.exists(src):
        print(f"Non trovo {args.src} in public/content.")
        return 1

    stem, _ = os.path.splitext(args.src)
    dst = os.path.join(CONTENT, f"{stem}-blur.jpg")

    image = Image.open(src).convert("RGB")
    scale = WIDTH / image.width
    image = image.resize((WIDTH, round(image.height * scale)), Image.LANCZOS)
    image = image.filter(ImageFilter.GaussianBlur(RADIUS))
    image.save(dst, "JPEG", quality=82, optimize=True, progressive=True)

    print(f"  {args.src} → {os.path.basename(dst)}")
    print(f"  {image.width}×{image.height} · sfocatura {RADIUS} · "
          f"{os.path.getsize(dst) // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
