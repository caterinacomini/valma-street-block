"use client";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export type IconId = "treno" | "bus" | "auto" | "parcheggio" | "piedi";

export type RouteSegment = {
  id: string;
  icon: IconId;
  path: string;
  pill?: { x: number; y: number; text: string };
  stop: string;
  at: number;
  dashed?: boolean;
};

export function Icon({
  id,
  color = "#ffffff",
}: {
  id: IconId;
  color?: string;
}) {
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

/**
 * Draws each leg, sends its vehicle along it and pops in the stop it departs
 * from. Shared by both maps: they are the same journey at two shapes, and
 * while the choreography lived in two places the wide one still required a
 * pill on every segment — so the two joining legs, which have none, were
 * silently skipped and never drew.
 */
export function buildRouteTimeline(
  root: SVGSVGElement,
  segments: RouteSegment[],
  meetingId: string,
  options: { start: string; end: string; scrub: number; pillLift: number },
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: options.start,
      end: options.end,
      scrub: options.scrub,
    },
  });

  segments.forEach((segment) => {
    const line = root.querySelector<SVGPathElement>(`#${segment.id}`);
    const vehicle = root.querySelector<SVGGElement>(`#veh-${segment.id}`);
    const pill = root.querySelector<SVGGElement>(`#pill-${segment.id}`);
    const stop = root.querySelector<SVGGElement>(`#${segment.stop}`);
    if (!line || !vehicle || !stop) return;

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
          motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5] },
        },
        at + 0.12,
      )
      .to(vehicle, { autoAlpha: 0, duration: 0.15 }, at + 0.97);

    if (pill) {
      tl.fromTo(
        pill,
        { autoAlpha: 0, y: options.pillLift },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
        at + 0.4,
      );
    }
  });

  tl.fromTo(
    meetingId,
    { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" },
    { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
    ">-0.3",
  );

  return tl;
}
