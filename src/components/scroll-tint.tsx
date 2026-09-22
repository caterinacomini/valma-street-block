"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WHITE = "#ffffff";
const BLUE = "#3e9ed4";
const FADE = 0.45;

/**
 * Turns the page a colour while this section holds the view, and gives it back
 * on the way out.
 *
 * It paints the body rather than the section itself. Colouring only the
 * section drew a hard line across the page where it met the white one above,
 * and that seam is the one thing this effect must not have: what reads as the
 * page changing colour cannot have an edge. Painting the body means every
 * neighbour that does not set its own background comes along, which is what
 * makes the change look like the page and not like a block.
 *
 * The switch is thrown at the middle of the screen rather than scrubbed along
 * the scroll. Tied to scroll position it drifted in gradually, which reads as
 * a gradient instead of a decision. Four callbacks, because scrolling back up
 * has to undo it in the same places it was done.
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
        gsap.to(document.body, {
          backgroundColor: ground,
          duration: FADE,
          ease: "power2.out",
        });
        if (labels.length) {
          gsap.to(labels, { color: label, duration: FADE, ease: "power2.out" });
        }
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
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

      /* Colour without the page changing under you. The ground is part of the
         design; the switching is not, so here the section carries it alone —
         seam and all, which is the honest trade for holding still. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { backgroundColor: BLUE });
        if (labels.length) gsap.set(labels, { color: WHITE });
      });
    }, ref);

    return () => {
      ctx.revert();
      gsap.set(document.body, { backgroundColor: WHITE });
    };
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
