"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { buildRouteTimeline, Icon, type IconId } from "./arrival-route";

/**
 * Stacked, the wide two-lane map has nowhere to go, so this is the same journey
 * turned on its side: two columns dropping down the screen and meeting at the
 * bottom. Scrolling drives the descent, which is the direction you are already
 * moving in.
 */
const STOPS = [
  {
    id: "treno",
    icon: "treno" as IconId,
    title: "Treno",
    detail: "Stazione di Lecco",
    x: 80,
    y: 50,
  },
  {
    id: "auto",
    icon: "auto" as IconId,
    title: "Auto",
    detail: "SS36, uscita Valmadrera",
    x: 280,
    y: 50,
  },
  {
    id: "bus",
    icon: "bus" as IconId,
    title: "Bus",
    detail: "Fermata Valmadrera",
    x: 80,
    y: 252,
  },
  {
    id: "parcheggio",
    icon: "parcheggio" as IconId,
    title: "Parcheggio",
    detail: "Segnalati in centro",
    x: 280,
    y: 252,
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
    id: "m-seg-treno",
    icon: "bus",
    path: "M 80 118 L 80 218",
    pill: { x: 80, y: 168, text: "15 min di bus" },
    stop: "m-stop-treno",
    at: 0,
  },
  {
    id: "m-seg-auto",
    icon: "auto",
    path: "M 280 118 L 280 218",
    pill: { x: 280, y: 168, text: "uscita SS36" },
    stop: "m-stop-auto",
    at: 0.06,
  },
  // The two ways join here. Sharing one walking leg beats printing the same
  // "5 min a piedi" twice, once per lane.
  {
    id: "m-seg-join-bus",
    icon: "piedi",
    path: "M 80 330 C 80 366 132 372 180 386",
    stop: "m-stop-bus",
    at: 1,
  },
  {
    id: "m-seg-join-auto",
    icon: "piedi",
    path: "M 280 330 C 280 366 228 372 180 386",
    stop: "m-stop-parcheggio",
    at: 1.04,
  },
  {
    id: "m-seg-piedi",
    icon: "piedi",
    path: "M 180 386 L 180 452",
    pill: { x: 180, y: 419, text: "5 min a piedi" },
    stop: "m-stop-bus",
    at: 1.95,
    dashed: true,
  },
];

export function ArrivalMapMobile() {
  const rootRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          buildRouteTimeline(root, SEGMENTS, "#m-meeting-point", {
            start: "top 80%",
            end: "bottom 75%",
            scrub: 0.8,
            pillLift: 8,
          });
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 360 578"
      className="h-auto w-full"
      role="img"
      aria-label="Due modi per arrivare: in treno fino a Lecco e poi in bus fino a Valmadrera, oppure in auto dalla SS36 fino ai parcheggi in centro e cinque minuti a piedi. Entrambe le vie finiscono al parco di via Leopardi"
    >
      <text
        x="0"
        y="12"
        className="fill-blue"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2.4"
      >
        MEZZI PUBBLICI
      </text>
      <text
        x="360"
        y="12"
        textAnchor="end"
        className="fill-blue"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2.4"
      >
        IN AUTO
      </text>

      <defs>
        {/* Same aerosol edge as the yellow stripe, in blue. These legs draw
            themselves with strokeDashoffset, so they have to stay real strokes
            rather than filled outlines — which means the width cannot swell
            through the bends the way the stripe's does. Kept to two octaves:
            the filter re-runs on every scrubbed frame. */}
        <filter id="mmap-spray" x="-12%" y="-12%" width="124%" height="124%">
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
      <g filter="url(#mmap-spray)">
        {SEGMENTS.map((segment) => (
          <path
            key={segment.id}
            id={segment.id}
            d={segment.path}
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="7"
            strokeOpacity={segment.dashed ? 0.7 : 1}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Stops */}
      {STOPS.map((stop) => (
        <g key={stop.id} id={`m-stop-${stop.id}`}>
          <circle cx={stop.x} cy={stop.y} r="22" className="fill-ink" />
          <g transform={`translate(${stop.x} ${stop.y})`}>
            <Icon id={stop.icon} />
          </g>
          <text
            x={stop.x}
            y={stop.y + 40}
            textAnchor="middle"
            className="fill-ink font-display"
            fontSize="18"
          >
            {stop.title.toUpperCase()}
          </text>
          <text
            x={stop.x}
            y={stop.y + 56}
            textAnchor="middle"
            className="fill-ink/60"
            fontSize="11.5"
          >
            {stop.detail}
          </text>
        </g>
      ))}

      {/* Info pills */}
      {SEGMENTS.filter((segment) => segment.pill).map((segment) => (
        <g key={`pill-${segment.id}`} id={`pill-${segment.id}`}>
          <rect
            x={segment.pill!.x - 70}
            y={segment.pill!.y - 15}
            width="140"
            height="30"
            rx="15"
            className="fill-white stroke-ink/25"
            strokeWidth="1.5"
          />
          <text
            x={segment.pill!.x}
            y={segment.pill!.y + 5}
            textAnchor="middle"
            className="fill-ink"
            fontSize="12.5"
            fontWeight="600"
          >
            {segment.pill!.text}
          </text>
        </g>
      ))}

      {/* Travelling vehicles */}
      {SEGMENTS.map((segment) => (
        <g key={`veh-${segment.id}`} id={`veh-${segment.id}`}>
          <circle r="15" className="fill-blue" />
          <Icon id={segment.icon} />
        </g>
      ))}

      {/* Both ways end here */}
      <g id="m-meeting-point">
        <circle cx="180" cy="486" r="32" className="fill-yellow" />
        <g
          transform="translate(180 486)"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M-9 -14v28" />
          <path d="M-9 -13h18l-3.2 6.5L10 -0.5H-9" />
        </g>
        <text
          x="180"
          y="536"
          textAnchor="middle"
          className="fill-ink font-display"
          fontSize="22"
        >
          RITROVO
        </text>
        <text
          x="180"
          y="556"
          textAnchor="middle"
          className="fill-ink/60"
          fontSize="12"
        >
          Parco di via Leopardi
        </text>
      </g>
    </svg>
  );
}
