"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect users who ask the OS for reduced motion: no inertia for them.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // ScrollSmoother takes over the scroll position, so native anchor jumps
    // would land in the wrong place — route them through the smoother.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      smoother.scrollTo(target, true, "top 72px");
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
