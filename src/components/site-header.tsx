"use client";

import type { NavLink } from "@/lib/sections";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";


import { RegisterButton } from "./register-button";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/** WCAG relative luminance. */
function luminance([r, g, b]: number[]) {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: number, b: number) {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

/** First ancestor that actually paints something, ignoring transparent ones. */
function paintedBackground(node: Element | null): number[] | null {
  let el: Element | null = node;
  while (el && el !== document.documentElement) {
    const bg = getComputedStyle(el).backgroundColor;
    const m = bg.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(",").map((v) => parseFloat(v));
      const alpha = parts.length > 3 ? parts[3] : 1;
      if (alpha > 0.5) return parts.slice(0, 3);
    }
    el = el.parentElement;
  }
  const body = getComputedStyle(document.body).backgroundColor.match(
    /rgba?\(([^)]+)\)/,
  );
  return body
    ? body[1]
        .split(",")
        .map((v) => parseFloat(v))
        .slice(0, 3)
    : null;
}

export function SiteHeader({
  navLinks,
  registrationUrl,
  registrationOpen,
  registrationLabel,
  registrationClosedLabel,
  instagramUrl,
  facebookUrl,
}: {
  navLinks: NavLink[];
  registrationUrl?: string;
  registrationOpen?: boolean;
  registrationLabel?: string;
  registrationClosedLabel?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /**
   * Which colour the bar's type should be is not a fixed decision: it depends
   * on whatever section happens to be under it. So it is measured — sample the
   * painted background at three points across the bar, average the luminance,
   * and keep whichever of white or black has the better contrast against it.
   */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const measure = () => {
      const rect = header.getBoundingClientRect();
      const y = rect.top + rect.height / 2;
      const xs = [rect.width * 0.12, rect.width * 0.5, rect.width * 0.88];

      let total = 0;
      let taken = 0;
      for (const x of xs) {
        const under = document
          .elementsFromPoint(x, y)
          .find((node) => !header.contains(node));
        const rgb = paintedBackground(under ?? null);
        if (rgb) {
          total += luminance(rgb);
          taken += 1;
        }
      }
      if (!taken) return;

      const behind = total / taken;
      const white = contrast(1, behind);
      const black = contrast(0, behind);
      setOnLight(black > white);
    };

    measure();
    // ScrollSmoother owns the scroll position, so the samples come from its
    // updates. The native listener is a second channel rather than a duplicate:
    // if the smoother is absent — reduced motion, or a failure setting it up —
    // this is the only one that fires, and the bar would otherwise be stuck on
    // whatever colour it picked at mount.
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: measure,
      onRefresh: measure,
    });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      trigger.kill();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Over the open menu the ground is the blue overlay, which wants white.
  const darkType = onLight && !open;
  const social = [
    instagramUrl ? { href: instagramUrl, label: "Instagram" } : null,
    facebookUrl ? { href: facebookUrl, label: "Facebook" } : null,
  ].filter((link) => link !== null);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        darkType ? "text-ink" : "text-white"
      }`}
    >
      {/* Hero recipe, identical at every scroll position: blur fading
          downward with grain over it, and nothing else. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 -bottom-10 transition-opacity duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Steps, not a gradient. A mask on the same element stops the browser
            painting its backdrop-filter at all — which is why raising the blur
            from 6 to 24 over three commits changed nothing. So the fade is four
            strips of falling height, each filtering what the one above already
            filtered; the steps are small enough to read as one soft edge. */}
        <div className="absolute inset-x-0 top-0 h-full backdrop-blur-[3px]" />
        <div className="absolute inset-x-0 top-0 h-[78%] backdrop-blur-[5px]" />
        <div className="absolute inset-x-0 top-0 h-[56%] backdrop-blur-[9px]" />
        <div className="absolute inset-x-0 top-0 h-[34%] backdrop-blur-[14px]" />
        <div
          className={`absolute inset-0 transition-colors duration-200 [mask-image:linear-gradient(to_bottom,black_0%,black_48%,transparent_100%)] ${
            darkType
              ? "bg-gradient-to-b from-white/55 via-white/20 to-transparent"
              : "bg-gradient-to-b from-ink/28 via-ink/8 to-transparent"
          }`}
        />
        <div className="grain absolute inset-0 opacity-35 mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_100%)]" />
      </div>

      <div className="page-x relative flex items-center justify-between gap-3 py-3 sm:py-4">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Valma Street Block"
            width={44}
            height={44}
            className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
          />
          <span className="min-w-0">
            <span className="block font-display text-lg leading-tight tracking-wide whitespace-nowrap sm:text-base">
              VALMA STREET BLOCK
            </span>
            <span className="hidden text-[9px] font-semibold whitespace-nowrap opacity-80 sm:block sm:text-xs">
              10 Apr 2027 · Valmadrera
            </span>
          </span>
        </a>

        <div className="ml-auto hidden lg:block">
          {!open ? (
            <RegisterButton
              registrationUrl={registrationUrl}
              open={registrationOpen}
              label={registrationLabel}
              closedLabel={registrationClosedLabel}
              size="sm"
            />
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-yellow px-4 font-sans text-sm font-bold tracking-wide text-ink uppercase transition"
        >
          {open ? "Chiudi" : "Menu"}
        </button>
      </div>

      {/* Full-screen overlay. Footer vocabulary — blue ground, yellow Koulen,
          hairline white rules — with the type sized off the viewport so it
          fills the screen. Sits at -z-10 inside the header's own stacking
          context, which keeps the Chiudi button on top of it. */}
      {open && (
        <div className="fixed inset-0 -z-10 overflow-y-auto bg-blue/88 backdrop-blur-2xl">
          <div className="grain pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" />

          <div className="relative flex min-h-full flex-col px-[5vw] pt-20 pb-8 sm:pt-24 lg:px-24">
            {/* The nav itself, tight and oversized */}
            <ul className="flex flex-col gap-4 pt-6 pb-8 lg:gap-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-[15.03vw] leading-[1.02] whitespace-nowrap text-yellow uppercase transition-transform duration-300 hover:translate-x-2 lg:text-[9vw]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <RegisterButton
              registrationUrl={registrationUrl}
              open={registrationOpen}
              label={registrationLabel}
              closedLabel={registrationClosedLabel}
              variant="dark"
              size="lg"
              className="mt-2 w-full sm:w-auto sm:self-start"
            />

            {/* Bottom band, mirroring the footer's own closing row */}
            <div className="mt-auto flex flex-col gap-4">
              {social.length > 0 ? (
                <ul className="flex flex-wrap gap-x-6 gap-y-1">
                  {social.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 py-1 text-sm font-semibold tracking-wide text-white/85 uppercase decoration-2 underline-offset-[6px] transition hover:underline"
                      >
                        {link.label}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        >
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}

              <p className="text-xs text-white/70">
                Organizzato da CAI Valmadrera e OSA Valmadrera
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
