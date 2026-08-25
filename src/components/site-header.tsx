"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { navLinks } from "./nav-links";
import { RegisterButton } from "./register-button";

gsap.registerPlugin(ScrollTrigger);

export function SiteHeader({ registrationUrl }: { registrationUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Go solid once the hero has scrolled past, not on the first few pixels.
    // ScrollSmoother drives the scroll position, so window.scrollY stays 0 —
    // this has to go through ScrollTrigger.
    const hero = document.getElementById("top");

    const trigger = hero
      ? ScrollTrigger.create({
          trigger: hero,
          start: "bottom top",
          end: "max",
          onToggle: (self) => setScrolled(self.isActive),
          onRefresh: (self) => setScrolled(self.isActive),
        })
      : ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => setScrolled(self.scroll() > 24),
          onRefresh: (self) => setScrolled(self.scroll() > 24),
        });

    return () => trigger.kill();
  }, []);

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      {/* Light blur that fades out downward, so the bar doesn't cut a hard edge */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 -bottom-8 transition-opacity duration-300 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/20 to-transparent" />
      </div>

      {/* Solid bar once scrolled */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-ink/90 backdrop-blur-md transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />

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
            <span className="block font-display text-xs leading-tight tracking-wide whitespace-nowrap sm:text-base">
              VALMA STREET BLOCK
            </span>
            <span className="block text-[9px] font-semibold whitespace-nowrap text-white sm:text-xs">
              10 Apr 2027 · Valmadrera
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-semibold tracking-wide text-white uppercase transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-yellow after:transition-transform after:duration-300 hover:text-yellow hover:after:origin-left hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <RegisterButton registrationUrl={registrationUrl} size="sm" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-yellow lg:hidden"
        >
          <span
            className={`h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="page-x relative flex flex-col border-t border-white/10 bg-ink pb-4 lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/8 py-4 font-display text-lg text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="py-4">
            <RegisterButton
              registrationUrl={registrationUrl}
              className="w-full"
            />
          </div>
        </nav>
      )}
    </header>
  );
}
