"use client";

const between = (min: number, max: number) => min + Math.random() * (max - min);

export { between };

export type Point = { x: number; y: number };
export type Speck = { x: number; y: number; r: number; o: number };

/**
 * Turns a centreline into a filled outline whose half-width swells where the
 * line bends — a can held at the same distance lays down more paint through a
 * turn, because the nozzle dwells longer over the same stretch of wall. A
 * plain stroke cannot vary its width, so the band has to be built by hand.
 */
export function buildSpray(core: SVGPathElement, base: number) {
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

/**
 * The two filters that make a flat shape look like it came out of a can: one
 * pushes the edge around with fractal noise, the other punches a finer noise
 * through the paint so the fill is grainy rather than solid.
 */
export function SprayFilters({
  id,
  seed = 3,
  displace = 22,
}: {
  id: string;
  seed?: number;
  displace?: number;
}) {
  return (
    <defs>
      <filter id={`${id}-ragged`} x="-15%" y="-8%" width="130%" height="116%">
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
          scale={displace}
          xChannelSelector="R"
          yChannelSelector="G"
          result="ragged"
        />
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

      <filter id={`${id}-haze`} x="-25%" y="-12%" width="150%" height="124%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
  );
}
