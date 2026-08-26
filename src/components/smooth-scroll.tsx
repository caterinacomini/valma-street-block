"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // Respect users who ask the OS for reduced motion: no inertia for them.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      // allowNestedScroll lets touch gestures inside horizontally scrollable
      // children (the editions carousel) through, instead of being swallowed
      // by the normalizer.
      normalizeScroll: { allowNestedScroll: true },
      ignoreMobileResize: true,
    });

    // Child effects run before this one, so any ScrollTrigger created in a
    // section measured its pin spacing without the smoother in place. Refresh
    // once the smoother exists so those measurements are redone correctly.
    ScrollTrigger.refresh();

    // Images finish decoding after mount and change section heights, which
    // shifts every trigger's start/end — recompute when the page is fully loaded.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      requestAnimationFrame(onLoad);
    } else {
      window.addEventListener("load", onLoad);
    }

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
      window.removeEventListener("load", onLoad);
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
