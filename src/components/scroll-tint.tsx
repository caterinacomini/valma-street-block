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
 * The type comes along too, but through CSS rather than through here: the
 * body gets a class and a stylesheet turns the whole section over at once.
 * Animating each element from JavaScript meant listing them, and a list like
 * that goes stale the first time someone adds a paragraph.
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
      const paint = (ground: string, tinted: boolean) => {
        gsap.to(document.body, {
          backgroundColor: ground,
          duration: FADE,
          ease: "power2.out",
        });
        document.body.classList.toggle("tinted", tinted);
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => paint(BLUE, true),
          onEnterBack: () => paint(BLUE, true),
          onLeave: () => paint(WHITE, false),
          onLeaveBack: () => paint(WHITE, false),
        });
      });

      /* Colour without the page changing under you. The ground is part of the
         design; the switching is not, so here the section carries it alone —
         seam and all, which is the honest trade for holding still. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { backgroundColor: BLUE });
        document.body.classList.add("tinted");
      });
    }, ref);

    return () => {
      ctx.revert();
      gsap.set(document.body, { backgroundColor: WHITE });
      document.body.classList.remove("tinted");
    };
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
