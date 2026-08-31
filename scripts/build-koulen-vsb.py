#!/usr/bin/env python3
"""
Builds src/app/fonts/KoulenVSB.ttf from scripts/koulen-original.ttf.

Koulen carries 98 Latin glyphs and not one of them is accented: no à è é ì ò ù,
no ª, no typographic apostrophe. The site is in Italian and most display text
comes from the CMS, so every "perché" an editor types would have had one letter
silently drawn by a different font — worst of all mid-word, and at a different
width, which breaks the footer wordmark whose size is calibrated to Koulen's
own ratio.

So the accents are drawn rather than borrowed: a slanted bar 250 units thick,
which is Koulen's stem width measured on the "I", set above each letter's cap
height. They belong to the face because they are built from its own weight.

Koulen is OFL, which permits modification but forbids reusing the original name
for a modified version — hence KoulenVSB in the name table.

    pip install fonttools
    python3 scripts/build-koulen-vsb.py
"""

import math
import os
import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "koulen-original.ttf")
DST = os.path.join(HERE, "..", "src", "app", "fonts", "KoulenVSB.ttf")

STEM = 250    # stem width, measured on "I" (bbox 81..331 at 2048 upem)
RISE = 118    # gap between cap height and the accent
LEN = 330     # length of the accent bar
SLANT = 150   # horizontal offset across that length — the slope
CAP = 1425    # cap height


def main() -> int:
    font = TTFont(SRC)
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    glyf, hmtx = font["glyf"], font["hmtx"]
    added: list[tuple[int, str]] = []

    def bounds(name):
        pen = BoundsPen(glyphs)
        glyphs[name].draw(pen)
        return pen.bounds

    def accent(pen, cx, top, kind):
        y0, y1 = top + RISE, top + RISE + LEN
        slope = -SLANT if kind == "grave" else SLANT
        lo, hi = cx - STEM / 2, cx + STEM / 2
        pen.moveTo((lo - slope / 2, y0))
        pen.lineTo((lo + slope / 2, y1))
        pen.lineTo((hi + slope / 2, y1))
        pen.lineTo((hi - slope / 2, y0))
        pen.closePath()

    def rect(pen, x0, y0, x1, y1):
        pen.moveTo((x0, y0))
        pen.lineTo((x0, y1))
        pen.lineTo((x1, y1))
        pen.lineTo((x1, y0))
        pen.closePath()

    def ring(pen, cx, cy, outer, inner, steps=32):
        # outer clockwise, inner anticlockwise, so the middle stays hollow
        for radius, direction in ((outer, 1), (inner, -1)):
            points = [
                (
                    cx + radius * math.cos(2 * math.pi * i / steps * direction),
                    cy + radius * math.sin(2 * math.pi * i / steps * direction),
                )
                for i in range(steps)
            ]
            pen.moveTo(points[0])
            for point in points[1:]:
                pen.lineTo(point)
            pen.closePath()

    def put(codepoint, name, draw, advance):
        pen = TTGlyphPen(glyphs)
        draw(pen)
        glyf[name] = pen.glyph()
        hmtx[name] = (advance, 0)
        added.append((codepoint, name))

    # ── accented vowels, grave and acute, both cases ──────────────────────
    pairs = {
        "A": (0xC0, 0xC1), "E": (0xC8, 0xC9), "I": (0xCC, 0xCD),
        "O": (0xD2, 0xD3), "U": (0xD9, 0xDA),
        "a": (0xE0, 0xE1), "e": (0xE8, 0xE9), "i": (0xEC, 0xED),
        "o": (0xF2, 0xF3), "u": (0xF9, 0xFA),
    }
    names = {
        0xC0: "Agrave", 0xC1: "Aacute", 0xC8: "Egrave", 0xC9: "Eacute",
        0xCC: "Igrave", 0xCD: "Iacute", 0xD2: "Ograve", 0xD3: "Oacute",
        0xD9: "Ugrave", 0xDA: "Uacute", 0xE0: "agrave", 0xE1: "aacute",
        0xE8: "egrave", 0xE9: "eacute", 0xEC: "igrave", 0xED: "iacute",
        0xF2: "ograve", 0xF3: "oacute", 0xF9: "ugrave", 0xFA: "uacute",
    }
    for char, (grave, acute) in pairs.items():
        base = cmap[ord(char)]
        box = bounds(base)
        cx, top = (box[0] + box[2]) / 2, box[3]
        for codepoint, kind in ((grave, "grave"), (acute, "acute")):
            pen = TTGlyphPen(glyphs)
            glyphs[base].draw(pen)
            accent(pen, cx, top, kind)
            name = names[codepoint]
            glyf[name] = pen.glyph()
            hmtx[name] = hmtx[base]
            added.append((codepoint, name))

    # ── ordinals, from the letters themselves shrunk and raised ───────────
    for char, name, codepoint in (("a", "ordfeminine", 0xAA), ("o", "ordmasculine", 0xBA)):
        base = cmap[ord(char)]
        box = bounds(base)
        scale = 0.52
        pen = TTGlyphPen(glyphs)
        glyphs[base].draw(TransformPen(pen, (scale, 0, 0, scale, 40, box[3] * (1 - scale))))
        glyf[name] = pen.glyph()
        hmtx[name] = (int(hmtx[base][0] * scale) + 80, 40)
        added.append((codepoint, name))

    # ── punctuation Koulen also lacks ─────────────────────────────────────
    put(0xB7, "periodcentered",
        lambda p: rect(p, 60, CAP * 0.36, 60 + STEM, CAP * 0.36 + STEM), STEM + 180)
    put(0x2013, "endash",
        lambda p: rect(p, 40, CAP * 0.40, 600, CAP * 0.40 + STEM * 0.75), 640)
    put(0x2014, "emdash",
        lambda p: rect(p, 40, CAP * 0.40, 940, CAP * 0.40 + STEM * 0.75), 980)
    put(0xB0, "degree",
        lambda p: ring(p, 250, CAP - 260, 250, 250 - STEM * 0.72), 520)
    put(0x2026, "ellipsis",
        lambda p: [rect(p, 60 + i * 380, 0, 60 + i * 380 + STEM, STEM) for i in range(3)] and None,
        3 * 380 + 120)

    # ── quotes, copied from the straight marks the face already has ───────
    for source, targets in (
        ("'", ((0x2019, "quoteright"), (0x2018, "quoteleft"))),
        ('"', ((0x201C, "quotedblleft"), (0x201D, "quotedblright"))),
    ):
        src = cmap[ord(source)]
        for codepoint, name in targets:
            pen = TTGlyphPen(glyphs)
            glyphs[src].draw(pen)
            glyf[name] = pen.glyph()
            hmtx[name] = hmtx[src]
            added.append((codepoint, name))

    for subtable in font["cmap"].tables:
        if subtable.isUnicode():
            for codepoint, name in added:
                subtable.cmap[codepoint] = name

    # both the font and the glyf table keep their own order, and they must agree
    order = font.getGlyphOrder() + [n for _, n in added if n not in font.getGlyphOrder()]
    font.setGlyphOrder(order)
    glyf.glyphOrder = order

    # OFL: a modified version may not carry the original's reserved name
    for record in font["name"].names:
        if record.nameID in (1, 3, 4, 6):
            record.string = record.toUnicode().replace("Koulen", "KoulenVSB")

    font.save(DST)
    print(f"{len(added)} glyphs added → {os.path.relpath(DST, os.path.join(HERE, '..'))}")
    print("  " + " ".join(chr(c) for c, _ in added))
    return 0


if __name__ == "__main__":
    sys.exit(main())
