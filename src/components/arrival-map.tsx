"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

type IconId = "treno" | "bus" | "auto" | "parcheggio" | "piedi";

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
    detail: "Linea per Valmadrera",
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

const SEGMENTS = [
  {
    id: "seg-treno",
    icon: "treno" as IconId,
    path: "M 200 70 L 900 70 C 980 70 1030 100 1030 150",
    pill: { x: 550, y: 70, text: "35 min di treno" },
    stop: "stop-treno",
    at: 0,
  },
  {
    id: "seg-bus",
    icon: "bus" as IconId,
    path: "M 1030 210 C 1030 262 960 250 870 250 L 655 292",
    pill: { x: 790, y: 250, text: "15 min di bus" },
    stop: "stop-bus",
    at: 0.5,
  },
  {
    id: "seg-auto",
    icon: "auto" as IconId,
    path: "M 200 550 L 900 550 C 980 550 1030 520 1030 470",
    pill: { x: 550, y: 550, text: "uscita SS36" },
    stop: "stop-auto",
    at: 0.08,
  },
  {
    id: "seg-piedi",
    icon: "piedi" as IconId,
    path: "M 1030 410 C 1030 358 960 370 870 370 L 655 328",
    pill: { x: 790, y: 370, text: "5 min a piedi" },
    stop: "stop-parcheggio",
    at: 0.58,
    dashed: true,
  },
];

function Icon({ id, color = "#ffffff" }: { id: IconId; color?: string }) {
  const s = {
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (id) {
    case "treno":
      return (
        <g {...s}>
          <rect x="-8" y="-9" width="16" height="13" rx="3.5" />
          <path d="M-8 -2.5h16" />
          <path d="M-4.5 4l-2.5 4.5M4.5 4l2.5 4.5" />
        </g>
      );
    case "bus":
      return (
        <g {...s}>
          <rect x="-9" y="-8" width="18" height="12" rx="3" />
          <path d="M-9 -1.5h18" />
          <circle cx="-4.5" cy="6.5" r="1.8" />
          <circle cx="4.5" cy="6.5" r="1.8" />
        </g>
      );
    case "auto":
      return (
        <g {...s}>
          <path d="M-9 2.5h18M-7.5 2.5l1.8-6h11.4l1.8 6" />
          <circle cx="-4.5" cy="5.5" r="1.9" />
          <circle cx="4.5" cy="5.5" r="1.9" />
        </g>
      );
    case "parcheggio":
      return (
        <text
          textAnchor="middle"
          y="8"
          fill={color}
          fontSize="23"
          fontWeight="700"
          fontFamily="var(--font-sans)"
        >
          P
        </text>
      );
    case "piedi":
      return (
        <g {...s}>
          <circle cx="0" cy="-7" r="2.6" />
          <path d="M0 -4v6M0 2l-4 6M0 2l4 6M-4 -1l4-1 4 1" />
        </g>
      );
  }
}

export function ArrivalMap() {
  const rootRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            end: "bottom 62%",
            scrub: 0.8,
          },
        });

        SEGMENTS.forEach((segment) => {
          const line = root.querySelector<SVGPathElement>(`#${segment.id}`);
          const vehicle = root.querySelector<SVGGElement>(`#veh-${segment.id}`);
          const pill = root.querySelector<SVGGElement>(`#pill-${segment.id}`);
          const stop = root.querySelector<SVGGElement>(`#${segment.stop}`);
          if (!line || !vehicle || !pill || !stop) return;

          const length = line.getTotalLength();
          const at = segment.at;

          tl.fromTo(
            stop,
            { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" },
            { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" },
            at,
          )
            .fromTo(
              line,
              { strokeDasharray: length, strokeDashoffset: length },
              { strokeDashoffset: 0, ease: "none", duration: 0.85 },
              at + 0.12,
            )
            .fromTo(
              vehicle,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.1, ease: "none" },
              at + 0.12,
            )
            .to(
              vehicle,
              {
                duration: 0.85,
                ease: "none",
                motionPath: {
                  path: line,
                  align: line,
                  alignOrigin: [0.5, 0.5],
                },
              },
              at + 0.12,
            )
            .to(vehicle, { autoAlpha: 0, duration: 0.15 }, at + 0.97)
            .fromTo(
              pill,
              { autoAlpha: 0, y: 10 },
              { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
              at + 0.4,
            );
        });

        tl.fromTo(
          "#meeting-point",
          { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
          ">-0.3",
        );
      });
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

      {/* Legs */}
      {SEGMENTS.map((segment) => (
        <path
          key={segment.id}
          id={segment.id}
          d={segment.path}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          strokeOpacity={segment.dashed ? 0.35 : 0.5}
          strokeLinecap="round"
          {...(segment.dashed ? { strokeDasharray: "8 10" } : {})}
        />
      ))}

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
      {SEGMENTS.map((segment) => (
        <g key={`pill-${segment.id}`} id={`pill-${segment.id}`}>
          <rect
            x={segment.pill.x - 105}
            y={segment.pill.y - 21}
            width="210"
            height="42"
            rx="21"
            className="fill-white stroke-ink/25"
            strokeWidth="1.5"
          />
          <text
            x={segment.pill.x}
            y={segment.pill.y + 6}
            textAnchor="middle"
            className="fill-ink"
            fontSize="16"
            fontWeight="600"
          >
            {segment.pill.text}
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
        <text x="540" y="330" textAnchor="end" className="fill-ink/60" fontSize="16">
          Parco di via Leopardi
        </text>
      </g>
    </svg>
  );
}
