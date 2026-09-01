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
    y: 62,
    labelAt: "below" as const,
  },
  {
    id: "bus",
    icon: "bus" as IconId,
    title: "Bus",
    detail: "Fermata Valmadrera",
    x: 1030,
    y: 134,
    labelAt: "right" as const,
  },
  {
    id: "parcheggio",
    icon: "parcheggio" as IconId,
    title: "Parcheggio",
    detail: "Segnalati in centro",
    x: 1030,
    y: 306,
    labelAt: "right" as const,
  },
  {
    id: "auto",
    icon: "auto" as IconId,
    title: "Auto",
    detail: "SS36, uscita Valmadrera",
    x: 170,
    y: 378,
    labelAt: "above" as const,
  },
];

/* Waves, not rules: gentle where the journey is still far away and livelier as
   it nears the meeting point, so the line itself says you are getting closer. */
const TRENO_PATH =
  "M 200 62 C 238 68, 262 68, 300 62 C 338 55, 362 55, 400 62 C 438 71, 462 71, 500 62 C 538 52, 562 52, 600 62 C 638 74, 662 74, 700 62 C 738 48, 762 48, 800 62 C 838 77, 862 77, 900 62 C 980 62, 1030 81, 1030 114";

const AUTO_PATH =
  "M 200 378 C 238 384, 262 384, 300 378 C 338 371, 362 371, 400 378 C 438 387, 462 387, 500 378 C 538 368, 562 368, 600 378 C 638 390, 662 390, 700 378 C 738 364, 762 364, 800 378 C 838 393, 862 393, 900 378 C 980 378, 1030 359, 1030 326";

const PIEDI_PATH =
  "M 880 220 C 849 232, 833 232, 801 220 C 770 207, 754 207, 723 220 C 691 234, 675 234, 644 220";

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
    path: TRENO_PATH,
    pill: { x: 550, y: 62, text: "15 min di bus" },
    stop: "stop-treno",
    at: 0,
  },
  {
    id: "seg-auto",
    icon: "auto",
    path: AUTO_PATH,
    pill: { x: 550, y: 378, text: "uscita SS36" },
    stop: "stop-auto",
    at: 0.06,
  },
  // Both ways join before the last stretch, so the walk is stated once rather
  // than printed twice, once per lane.
  {
    id: "seg-join-bus",
    icon: "piedi",
    path: "M 1030 154 C 1030 196 950 208 880 217",
    stop: "stop-bus",
    at: 1,
  },
  {
    id: "seg-join-auto",
    icon: "piedi",
    path: "M 1030 286 C 1030 244 950 232 880 223",
    stop: "stop-parcheggio",
    at: 1.04,
  },
  {
    id: "seg-piedi",
    icon: "piedi",
    path: PIEDI_PATH,
    pill: { x: 762, y: 220, text: "5' a piedi" },
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
            /* Done by the time the map sits in the middle of the screen:
               finishing later left it half-drawn exactly when it is being read. */
            start: "top 88%",
            end: "center 58%",
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
      viewBox="0 0 1360 450"
      className="h-auto w-full"
      role="img"
      aria-label="Due modi per arrivare: in treno fino a Lecco e poi in bus fino a Valmadrera, oppure in auto dalla SS36 fino ai parcheggi in centro e cinque minuti a piedi fino al parco di via Leopardi"
    >
      {/* Route family labels */}
      <text
        x="0"
        y="24"
        className="fill-blue"
        fontSize="18"
        fontWeight="700"
        letterSpacing="3"
      >
        MEZZI PUBBLICI
      </text>
      <text
        x="0"
        y="612"
        className="fill-blue"
        fontSize="18"
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
      <g>
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
              <Icon id={stop.icon} size={28} />
            </g>
            <text
              x={labelProps.x}
              y={stop.y + labelProps.dy[0]}
              textAnchor={labelProps.anchor}
              className="fill-ink font-sans"
              fontWeight="700"
              letterSpacing="-0.5"
              fontSize="46"
            >
              {stop.title.toUpperCase()}
            </text>
            <text
              x={labelProps.x}
              y={stop.y + labelProps.dy[1]}
              textAnchor={labelProps.anchor}
              className="fill-ink/55 font-sans"
              fontWeight="700"
              letterSpacing="1.2"
              fontSize="16"
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
            x={segment.pill!.x - 76}
            y={segment.pill!.y - 15}
            width="152"
            height="30"
            rx="0"
            className="fill-white"
          />
          <text
            x={segment.pill!.x}
            y={segment.pill!.y + 5}
            textAnchor="middle"
            className="fill-ink font-sans"
            fontSize="15"
            fontWeight="700"
            letterSpacing="1"
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
        <circle cx="600" cy="220" r="30" className="fill-yellow" />
        <g
          transform="translate(600 220)"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M-7 -11v22" />
          <path d="M-7 -10.5h15l-2.7 5.3L8.5 -0.4H-7" />
        </g>
        <text
          x="540"
          y="304"
          textAnchor="end"
          className="fill-ink font-sans"
              fontWeight="700"
              letterSpacing="-0.5"
          fontSize="48"
        >
          RITROVO
        </text>
        <text
          x="540"
          y="330"
          textAnchor="end"
          className="fill-ink/55 font-sans"
              fontWeight="700"
              letterSpacing="1.2"
          fontSize="17"
        >
          Parco di via Leopardi
        </text>
      </g>
    </svg>
  );
}
