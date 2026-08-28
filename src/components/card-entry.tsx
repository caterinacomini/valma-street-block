"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Arrives as a card, opens out to full bleed while it is on screen, and closes
 * back to a card on the way out. Scrubbed across the element's whole passage
 * through the viewport, with a hold in the middle so the open state lasts.
 *
 * The shape is driven through two custom properties rather than two clip-path
 * strings — gsap normalises `inset(0% 0% 0% 0% round 0px)` down to `inset(0%)`,
 * and interpolating between shapes of different structure is unreliable. This
 * way the string never changes, only the numbers in it.
 */
export function CardEntry({
  children,
  className = "",
  media = "(min-width: 0px)",
  inset = "7%",
  radius = "44px",
  rise = 56,
}: {
  children: React.ReactNode;
  className?: string;
  media?: string;
  inset?: string;
  radius?: string;
  rise?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(`${media} and (prefers-reduced-motion: no-preference)`, () => {
        const closed = { "--card-inset": inset, "--card-radius": radius };
        const open = { "--card-inset": "0%", "--card-radius": "0px" };

        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            el,
            { ...closed, y: rise },
            { ...open, y: 0, ease: "none", duration: 1 },
          )
          // an empty tween, purely to hold the open state through the middle
          .to({}, { duration: 1.4 })
          .to(el, { ...closed, y: -rise, ease: "none", duration: 1 });
      });
    }, el);

    return () => ctx.revert();
  }, [media, inset, radius, rise]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath:
          "inset(0% var(--card-inset, 0%) 0% var(--card-inset, 0%) round var(--card-radius, 0px))",
      }}
    >
      {children}
    </div>
  );
}
