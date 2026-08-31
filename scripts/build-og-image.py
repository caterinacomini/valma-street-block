#!/usr/bin/env python3
"""
Builds public/og.jpg — the picture that appears when the site's link is pasted
into a chat or posted on social.

It is the footer's composition rather than the hero's: solid blue under the
yellow wordmark. A link lives at about 200px wide in a WhatsApp thread, and a
block of flat colour survives that where a photograph turns to mush; the
photograph then gets the lower two thirds, so the card still shows the event
rather than only naming it.

    python3 scripts/build-og-image.py [--photo NAME] [--band PIXELS]
"""

import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
FONT = os.path.join(ROOT, "src", "app", "fonts", "KoulenVSB.ttf")
CONTENT = os.path.join(ROOT, "public", "content")
DST = os.path.join(ROOT, "public", "og.jpg")

WIDTH, HEIGHT = 1200, 630      # the size every platform crops from
MARGIN = 52
YELLOW, BLUE = (255, 224, 0), (62, 158, 212)
WORDMARK = "VALMA STREET BLOCK"


def fit(text, max_width, start=240):
    """Largest size at which the wordmark still fits the column."""
    size = start
    while size > 10:
        font = ImageFont.truetype(FONT, size)
        box = font.getbbox(text)
        if box[2] - box[0] <= max_width:
            return font, box
        size -= 2
    raise SystemExit("wordmark will not fit")


def cover(path, box_w, box_h, focus_x=0.58, focus_y=0.38):
    """object-fit: cover, with a focal point."""
    image = Image.open(path).convert("RGB")
    w, h = image.size
    scale = max(box_w / w, box_h / h)
    scaled = image.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    x = int((scaled.width - box_w) * focus_x)
    y = int((scaled.height - box_h) * focus_y)
    return scaled.crop((x, y, x + box_w, y + box_h))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--photo", default="urban-climbing-bridge-dyno.jpg")
    parser.add_argument("--band", type=int, default=220,
                        help="height of the blue band holding the wordmark")
    args = parser.parse_args()

    card = Image.new("RGB", (WIDTH, HEIGHT), BLUE)
    photo_h = HEIGHT - args.band
    card.paste(cover(os.path.join(CONTENT, args.photo), WIDTH, photo_h), (0, args.band))

    draw = ImageDraw.Draw(card)
    font, box = fit(WORDMARK, WIDTH - 2 * MARGIN)
    height = box[3] - box[1]
    while height > args.band - 40 and font.size > 20:
        font = ImageFont.truetype(FONT, font.size - 2)
        box = font.getbbox(WORDMARK)
        height = box[3] - box[1]
    draw.text((MARGIN - box[0], (args.band - height) // 2 - box[1]),
              WORDMARK, font=font, fill=YELLOW)

    card.save(DST, "JPEG", quality=90, optimize=True, progressive=True)
    print(f"public/og.jpg · {WIDTH}×{HEIGHT} · "
          f"{os.path.getsize(DST) // 1024} KB · wordmark {font.size}px")
    return 0


if __name__ == "__main__":
    sys.exit(main())
