"use client";

import { useEffect, useRef, useState } from "react";

const between = (min: number, max: number) => min + Math.random() * (max - min);

type Point = { x: number; y: number };
type Speck = { x: number; y: number; r: number; o: number };

type Box = { x: number; y: number; w: number; h: number };

/**
 * One continuous line down the whole list. It enters through one side and
 * leaves through the other, and is pinned to a point inside every card on the
 * way, so no card is ever missed — with purely random anchors some cards got
 * crossed and some did not.
 */
function makeCentreline(w: number, h: number, cards: Box[]): string {
  // control points may sit outside; the svg clips them, which is what gives
  // the stroke a clean bleed off the edge
  const clampX = (x: number) => Math.max(-70, Math.min(w + 70, x));
  const clampY = (y: number) => Math.max(10, Math.min(h - 10, y));

  // Laid out in a row the cards run left to right, so the line has to enter on
  // the correct side or it doubles back across the whole section before it
  // reaches the first card.
  const horizontal =
    cards.length > 1 && cards[cards.length - 1].x - cards[0].x > w * 0.3;
  const fromLeft = horizontal ? true : Math.random() < 0.5;

  const anchors: Point[] = [
    {
      x: fromLeft ? -55 : w + 55,
      y: horizontal ? between(h * 0.2, h * 0.45) : between(h * 0.04, h * 0.14),
    },
  ];

  cards.forEach((c, i) => {
    // alternate which flank of the card it crosses, so the line keeps weaving
    const lean = i % 2 === (fromLeft ? 0 : 1);
    anchors.push({
      x: c.x + c.w * (lean ? between(0.2, 0.45) : between(0.55, 0.8)),
      y: c.y + c.h * between(0.3, 0.7),
    });
  });

  anchors.push({
    x: fromLeft ? w + 55 : -55,
    y: horizontal ? between(h * 0.55, h * 0.8) : between(h * 0.86, h * 0.97),
  });

  const legCount = anchors.length - 1;
  const loopA = Math.floor(Math.random() * legCount);
  let loopB = Math.floor(Math.random() * legCount);
  if (loopB === loopA) loopB = (loopB + 1) % legCount;
  let d = `M ${anchors[0].x} ${anchors[0].y}`;

  for (let i = 0; i < anchors.length - 1; i += 1) {
    const a = anchors[i];
    const b = anchors[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    // opposite signs fold the curve back through itself into a loop; matching
    // signs just bow it out into a sweep
    const s1 = (Math.random() < 0.5 ? -1 : 1) * len * between(0.6, 1.3);
    const s2 =
      i === loopA || i === loopB
        ? -Math.sign(s1) * len * between(0.9, 1.6)
        : (Math.random() < 0.5 ? -1 : 1) * len * between(0.35, 0.95);

    d +=
      ` C ${clampX(a.x + dx * 0.3 + nx * s1)} ${clampY(a.y + dy * 0.3 + ny * s1)}` +
      ` ${clampX(b.x - dx * 0.3 + nx * s2)} ${clampY(b.y - dy * 0.3 + ny * s2)}` +
      ` ${b.x} ${b.y}`;
  }

  return d;
}

/**
 * Turns a centreline into a filled outline whose half-width swells where the
 * line bends — a can held at the same distance lays down more paint through a
 * turn, because the nozzle dwells longer over the same stretch of wall. A
 * plain stroke cannot vary its width, so the band has to be built by hand.
 */
function buildSpray(core: SVGPathElement, base: number) {
  const total = core.getTotalLength();
  if (!total) return null;

  const samples = Math.min(420, Math.max(120, Math.round(total / 4)));
  const pts: Point[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const p = core.getPointAtLength((i / samples) * total);
    pts.push({ x: p.x, y: p.y });
  }

  const at = (i: number) => pts[Math.max(0, Math.min(samples, i))];
  const tangents = pts.map((_, i) => {
    const a = at(i - 1);
    const b = at(i + 1);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  });

  const bend = tangents.map((_, i) => {
    const a = tangents[Math.max(0, i - 4)];
    const b = tangents[Math.min(samples, i + 4)];
    return Math.abs(Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y));
  });
  const peak = Math.max(...bend, 0.001);

  // two out-of-phase waves instead of per-sample noise, so the edge wobbles
  // like a wavering hand rather than buzzing
  const f1 = between(0.04, 0.09);
  const f2 = between(0.11, 0.2);
  const p1 = Math.random() * Math.PI * 2;
  const p2 = Math.random() * Math.PI * 2;

  const half = pts.map((_, i) => {
    const t = i / samples;
    const swell = 0.45 + 1.75 * (bend[i] / peak);
    const wobble =
      1 + 0.13 * Math.sin(i * f1 + p1) + 0.08 * Math.sin(i * f2 + p2);
    // thin out over the first and last few percent, the way a stroke starts
    // and lifts off
    const ends = Math.min(1, t / 0.05, (1 - t) / 0.05) * 0.45 + 0.55;
    return (base / 2) * swell * wobble * ends;
  });

  const left: string[] = [];
  const right: string[] = [];
  pts.forEach((p, i) => {
    const nx = -tangents[i].y;
    const ny = tangents[i].x;
    left.push(`${p.x + nx * half[i]} ${p.y + ny * half[i]}`);
    right.push(`${p.x - nx * half[i]} ${p.y - ny * half[i]}`);
  });

  const outline = `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`;

  // overspray: dust either side of the line, denser where it is fattest
  const specks: Speck[] = [];
  const count = Math.round(total / 4);
  for (let i = 0; i < count; i += 1) {
    const k = Math.floor(Math.random() * (samples + 1));
    const nx = -tangents[k].y;
    const ny = tangents[k].x;
    const off = (Math.random() < 0.5 ? -1 : 1) * half[k] * between(1, 3.4);
    specks.push({
      x: pts[k].x + nx * off,
      y: pts[k].y + ny * off,
      r: between(0.6, 2.4),
      o: between(0.15, 0.6),
    });
  }

  return { outline, specks };
}

export function ProgramRibbon() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [centre, setCentre] = useState<string | null>(null);
  const [spray, setSpray] = useState<{
    outline: string;
    specks: Speck[];
  } | null>(null);
  const [base] = useState(() => between(36, 50));
  const [seed] = useState(() => Math.floor(Math.random() * 1000));

  // Client-only: Math.random() during render would hand the server and the
  // browser different paths, which is a hydration mismatch.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cards = Array.from(
        el.parentElement?.querySelectorAll("article") ?? [],
      ).map((card) => {
        const c = card.getBoundingClientRect();
        return {
          x: c.left - r.left,
          y: c.top - r.top,
          w: c.width,
          h: c.height,
        };
      });
      setBox({ w: r.width, h: r.height });
      setCentre(makeCentreline(r.width, r.height, cards));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Second pass: the centreline has to exist in the document before its length
  // can be sampled, so the outline is built once it has rendered.
  useEffect(() => {
    if (!centre || !coreRef.current) return;
    setSpray(buildSpray(coreRef.current, base));
  }, [centre, base]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute -top-12 -right-6 -bottom-12 -left-6 -z-10 sm:-right-12 sm:-left-12 lg:-top-20 lg:-right-24 lg:-bottom-20 lg:-left-24"
    >
      {centre ? (
        <svg viewBox={`0 0 ${box.w} ${box.h}`} className="block h-full w-full">
          <defs>
            {/* Fractal noise pushing the shape around its own edge: an aerosol
                boundary is a cloud of droplets, not a cut line. */}
            <filter
              id="ribbon-ragged"
              x="-15%"
              y="-8%"
              width="130%"
              height="116%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves={4}
                seed={seed}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="22"
                xChannelSelector="R"
                yChannelSelector="G"
                result="ragged"
              />
              {/* A second, finer noise field turned into an alpha mask and
                  punched through the shape, so the paint itself is grainy
                  rather than a flat fill with a rough outline. */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1.7"
                numOctaves={2}
                seed={seed + 13}
                result="grain"
              />
              <feColorMatrix
                in="grain"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1.5 -0.32"
                result="grainAlpha"
              />
              <feComposite
                in="ragged"
                in2="grainAlpha"
                operator="in"
                result="speckled"
              />
              {/* a softened solid underneath, so the line still reads as a
                  line instead of dissolving into dust */}
              <feColorMatrix
                in="ragged"
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 0.5 0"
                result="base"
              />
              <feMerge>
                <feMergeNode in="base" />
                <feMergeNode in="speckled" />
              </feMerge>
            </filter>
            {/* the halo the can leaves around the stroke */}
            <filter
              id="ribbon-haze"
              x="-25%"
              y="-12%"
              width="150%"
              height="124%"
            >
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          {/* measured, never painted */}
          <path ref={coreRef} d={centre} fill="none" stroke="none" />

          {spray ? (
            <>
              <path
                d={spray.outline}
                fill="#ffe000"
                opacity="0.3"
                filter="url(#ribbon-haze)"
              />
              <path
                d={spray.outline}
                fill="#ffe000"
                filter="url(#ribbon-ragged)"
              />
              {spray.specks.map((s, i) => (
                <circle
                  key={i}
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill="#ffe000"
                  opacity={s.o}
                />
              ))}
            </>
          ) : null}
        </svg>
      ) : null}
    </div>
  );
}
