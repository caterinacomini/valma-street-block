"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { buildRouteTimeline, Icon, type IconId } from "./arrival-route";

// Two snaking routes that mirror each other and meet in the middle:
// train → bus coming down from the top, car → parking coming up from below.
const STOPS = [
  {
    id: "treno",
    icon: "treno" as IconId,
    title: "Treno",
    detail: "Stazione di Lecco",
    x: 170,
    y: 70,
    labelAt: "below" as const,
  },
  {
    id: "bus",
    icon: "bus" as IconId,
    title: "Bus",
    detail: "Fermata Valmadrera",
    x: 1030,
    y: 180,
    labelAt: "right" as const,
  },
  {
    id: "parcheggio",
    icon: "parcheggio" as IconId,
    title: "Parcheggio",
    detail: "Segnalati in centro",
    x: 1030,
    y: 440,
    labelAt: "right" as const,
  },
  {
    id: "auto",
    icon: "auto" as IconId,
    title: "Auto",
    detail: "SS36, uscita Valmadrera",
    x: 170,
    y: 550,
    labelAt: "above" as const,
  },
];

const SEGMENTS: {
  id: string;
  icon: IconId;
  path: string;
  pill?: { x: number; y: number; text: string };
  stop: string;
  at: number;
  dashed?: boolean;
}[] = [
  {
    id: "seg-treno",
    icon: "bus",
    path: "M 200 70 L 900 70 C 980 70 1030 100 1030 150",
    pill: { x: 550, y: 70, text: "15 min di bus" },
    stop: "stop-treno",
    at: 0,
  },
  {
    id: "seg-auto",
    icon: "auto",
    path: "M 200 550 L 900 550 C 980 550 1030 520 1030 470",
    pill: { x: 550, y: 550, text: "uscita SS36" },
    stop: "stop-auto",
    at: 0.06,
  },
  // Both ways join before the last stretch, so the walk is stated once rather
  // than printed twice, once per lane.
  {
    id: "seg-join-bus",
    icon: "piedi",
    path: "M 1030 210 C 1030 272 950 288 880 306",
    stop: "stop-bus",
    at: 1,
  },
  {
    id: "seg-join-auto",
    icon: "piedi",
    path: "M 1030 410 C 1030 348 950 332 880 314",
    stop: "stop-parcheggio",
    at: 1.04,
  },
  {
    id: "seg-piedi",
    icon: "piedi",
    path: "M 880 310 L 660 310",
    pill: { x: 776, y: 310, text: "5 min a piedi" },
    stop: "stop-bus",
    at: 1.95,
    dashed: true,
  },
];

export function ArrivalMap() {
  const rootRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          buildRouteTimeline(root, SEGMENTS, "#meeting-point", {
            start: "top 82%",
            end: "bottom 62%",
            scrub: 0.8,
            pillLift: 10,
          });
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 1360 620"
      className="h-auto w-full"
      role="img"
      aria-label="Due modi per arrivare: in treno fino a Lecco e poi in bus fino a Valmadrera, oppure in auto dalla SS36 fino ai parcheggi in centro e cinque minuti a piedi fino al parco di via Leopardi"
    >
      {/* Route family labels */}
      <text
        x="0"
        y="24"
        className="fill-blue"
        fontSize="14"
        fontWeight="700"
        letterSpacing="3"
      >
        MEZZI PUBBLICI
      </text>
      <text
        x="0"
        y="612"
        className="fill-blue"
        fontSize="14"
        fontWeight="700"
        letterSpacing="3"
      >
        IN AUTO
      </text>

      <defs>
        {/* Same aerosol edge as the yellow stripe, in blue. These legs draw
            themselves with strokeDashoffset, so they have to stay real strokes
            rather than filled outlines — which means the width cannot swell
            through the bends the way the stripe's does. Kept to two octaves:
            the filter re-runs on every scrubbed frame. */}
        <filter id="map-spray" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves={2}
            seed={11}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="ragged"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.9"
            numOctaves={1}
            seed={29}
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1.4 -0.3"
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
                    0 0 0 0.55 0"
            result="base"
          />
          <feMerge>
            <feMergeNode in="base" />
            <feMergeNode in="speckled" />
          </feMerge>
        </filter>
      </defs>

      {/* Legs */}
      <g filter="url(#map-spray)">
        {SEGMENTS.map((segment) => (
          <path
            key={segment.id}
            id={segment.id}
            d={segment.path}
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="9"
            strokeOpacity={segment.dashed ? 0.7 : 1}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Stops */}
      {STOPS.map((stop) => {
        const labelProps =
          stop.labelAt === "right"
            ? { x: stop.x + 46, anchor: "start" as const, dy: [-2, 22] }
            : stop.labelAt === "above"
              ? { x: stop.x, anchor: "middle" as const, dy: [-64, -42] }
              : { x: stop.x, anchor: "middle" as const, dy: [58, 80] };

        return (
          <g key={stop.id} id={`stop-${stop.id}`}>
            <circle cx={stop.x} cy={stop.y} r="30" className="fill-ink" />
            <g transform={`translate(${stop.x} ${stop.y})`}>
              <Icon id={stop.icon} />
            </g>
            <text
              x={labelProps.x}
              y={stop.y + labelProps.dy[0]}
              textAnchor={labelProps.anchor}
              className="fill-ink font-display"
              fontSize="26"
            >
              {stop.title.toUpperCase()}
            </text>
            <text
              x={labelProps.x}
              y={stop.y + labelProps.dy[1]}
              textAnchor={labelProps.anchor}
              className="fill-ink/60"
              fontSize="15"
            >
              {stop.detail}
            </text>
          </g>
        );
      })}

      {/* Info pills */}
      {SEGMENTS.filter((segment) => segment.pill).map((segment) => (
        <g key={`pill-${segment.id}`} id={`pill-${segment.id}`}>
          <rect
            x={segment.pill!.x - 105}
            y={segment.pill!.y - 21}
            width="210"
            height="42"
            rx="21"
            className="fill-white stroke-ink/25"
            strokeWidth="1.5"
          />
          <text
            x={segment.pill!.x}
            y={segment.pill!.y + 6}
            textAnchor="middle"
            className="fill-ink"
            fontSize="16"
            fontWeight="600"
          >
            {segment.pill!.text}
          </text>
        </g>
      ))}

      {/* Travelling vehicles */}
      {SEGMENTS.map((segment) => (
        <g key={`veh-${segment.id}`} id={`veh-${segment.id}`}>
          <circle r="19" className="fill-blue" />
          <Icon id={segment.icon} />
        </g>
      ))}

      {/* Meeting point, where both ways converge */}
      <g id="meeting-point">
        <circle cx="600" cy="310" r="46" className="fill-yellow" />
        <g
          transform="translate(600 310)"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M-10 -16v32" />
          <path d="M-10 -15h21l-3.8 7.6L12 -0.6H-10" />
        </g>
        <text
          x="540"
          y="304"
          textAnchor="end"
          className="fill-ink font-display"
          fontSize="30"
        >
          RITROVO
        </text>
        <text
          x="540"
          y="330"
          textAnchor="end"
          className="fill-ink/60"
          fontSize="16"
        >
          Parco di via Leopardi
        </text>
      </g>
    </svg>
  );
}
