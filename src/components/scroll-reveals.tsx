"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-in reveals, driven by markup instead of wrapper elements: any element
 * carrying data-reveal lifts into place when it reaches the fold, and
 * data-reveal="stagger" walks its direct children rather than moving as a block.
 *
 * The hidden starting state is set here, in JS, and deliberately never in CSS.
 * If this never runs — script blocked, an error earlier on the page — the
 * content is simply visible, rather than invisible forever.
 */
export function ScrollReveals() {
  useLayoutEffect(() => {
    // Same contract as SmoothScroll: asked for less motion, get none.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const stagger = el.dataset.reveal === "stagger";
        if (stagger && el.children.length === 0) return;

        gsap.from(stagger ? Array.from(el.children) : el, {
          opacity: 0,
          y: 18,
          duration: 0.5,
          ease: "power2.out",
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
