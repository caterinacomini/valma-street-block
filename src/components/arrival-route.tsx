"use client";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

import {
  Bus,
  Car,
  CircleParking,
  Footprints,
  TrainFront,
  type LucideIcon,
} from "lucide-react";

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

const GLYPHS: Record<IconId, LucideIcon> = {
  treno: TrainFront,
  bus: Bus,
  auto: Car,
  parcheggio: CircleParking,
  piedi: Footprints,
};

/**
 * Drawn by Lucide rather than by hand. They sit inside circles centred on the
 * origin, so the glyph — which Lucide draws from its top-left corner — is
 * shifted back by half its size.
 */
export function Icon({
  id,
  color = "#ffffff",
  size = 20,
}: {
  id: IconId;
  color?: string;
  size?: number;
}) {
  const Glyph = GLYPHS[id];
  return (
    <g transform={`translate(${-size / 2} ${-size / 2})`}>
      <Glyph width={size} height={size} color={color} strokeWidth={2} />
    </g>
  );
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
