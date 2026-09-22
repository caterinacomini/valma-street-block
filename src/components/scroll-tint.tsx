"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WHITE = "#ffffff";
const BLUE = "#3e9ed4";
const FADE = 0.45;

/**
 * A section that takes on colour while you are inside it and gives it back
 * when you leave.
 *
 * The switch is thrown at the middle of the screen, not scrubbed along the
 * scroll: the colour changes once, at its own speed, the moment the section
 * has taken over the view. Tying it to scroll position instead made it drift
 * in gradually, which reads as a gradient rather than a decision.
 *
 * Four callbacks rather than two, because scrolling back up has to undo it in
 * the same places it was done.
 *
 * Anything marked data-tint-label comes along: the small labels are the site's
 * blue and would disappear into the ground this paints.
 */
export function ScrollTint({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const labels = el.querySelectorAll("[data-tint-label]");

      const paint = (ground: string, label: string) => {
        gsap.to(el, { backgroundColor: ground, duration: FADE, ease: "power2.out" });
        if (labels.length) {
          gsap.to(labels, { color: label, duration: FADE, ease: "power2.out" });
        }
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { backgroundColor: WHITE });
        if (labels.length) gsap.set(labels, { color: BLUE });

        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => paint(BLUE, WHITE),
          onEnterBack: () => paint(BLUE, WHITE),
          onLeave: () => paint(WHITE, BLUE),
          onLeaveBack: () => paint(WHITE, BLUE),
        });
      });

      /* Colour without the scroll-linked change: the ground is part of the
         design, the switching under you is not. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { backgroundColor: BLUE });
        if (labels.length) gsap.set(labels, { color: WHITE });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
