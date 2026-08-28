"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type EditionCard = {
  id: string;
  year: number;
  editionNumber?: number;
  participantsCount?: number;
  coverUrl: string;
  /** Extra frames cycled on hover, like a little flipbook. */
  frames: string[];
};

function EditionThumb({ edition }: { edition: EditionCard }) {
  const [frame, setFrame] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const frames =
    edition.frames.length > 0 ? edition.frames : [edition.coverUrl];

  const start = () => {
    if (timer.current || frames.length < 2) return;
    timer.current = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, 420);
  };

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setFrame(0);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <article
      className="group relative aspect-[3/4] w-72 shrink-0 overflow-hidden rounded-3xl bg-ink sm:w-80 lg:h-[82dvh] lg:w-auto"
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      {frames.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? `Valma Street Block ${edition.year}` : ""}
          fill
          className={`object-cover transition-opacity duration-200 ${
            i === frame ? "opacity-100" : "opacity-0"
          }`}
          sizes="288px"
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />

      <div className="absolute inset-x-5 bottom-5">
        {/* Year, with the edition number ghosted behind it */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 font-display text-4xl leading-none text-white/20 lg:text-5xl"
          >
            {edition.editionNumber ? `0${edition.editionNumber}`.slice(-2) : ""}
          </span>
          <p className="relative font-display text-4xl leading-none text-white lg:text-5xl">
            {edition.year}
          </p>
        </div>

        {edition.editionNumber ? (
          <p className="mt-3 font-display text-lg tracking-wide text-white lg:text-xl">
            {edition.editionNumber}ª edizione
          </p>
        ) : null}

        {edition.participantsCount ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
            <span className="h-2 w-2 shrink-0 rounded-full bg-yellow" />+
            {edition.participantsCount} climbers
          </p>
        ) : null}
      </div>
    </article>
  );
}

const PHOTO_FINAL_WIDTH = 42; // % of the section, matches the lg:w-[42%] class

export function EdizioniCarousel({ editions }: { editions: EditionCard[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const stepWidth = () => {
    const first = cardsRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.getBoundingClientRect().width + 20 : 340;
  };

  /**
   * How far the strip has travelled comes from two places: the native scroll
   * position when it is swiped, and the transform GSAP writes when the page
   * scroll drives it. Adding them covers both without caring which is in charge.
   */
  useEffect(() => {
    const viewport = viewportRef.current;
    const cards = cardsRef.current;
    if (!viewport || !cards) return;

    const update = () => {
      const shifted =
        viewport.scrollLeft +
        Math.abs(Number(gsap.getProperty(cards, "x")) || 0);
      const total = cards.scrollWidth - viewport.clientWidth;
      setShowArrows(total > 24 && shifted > stepWidth() * 2.1);
    };

    update();
    viewport.addEventListener("scroll", update, { passive: true });
    const ticker = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh: update,
    });
    window.addEventListener("resize", update);

    return () => {
      viewport.removeEventListener("scroll", update);
      ticker.kill();
      window.removeEventListener("resize", update);
    };
  }, []);

  const advance = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const cards = cardsRef.current;
    if (!viewport || !cards) return;

    const step = stepWidth();
    const total = Math.max(0, cards.scrollWidth - viewport.clientWidth);

    /**
     * Snap to a card edge rather than nudging by a fixed amount. The scroll
     * hands the strip over at an arbitrary offset, so adding one card width to
     * that just carries the misalignment along and every card stays half cut.
     */
    const snapped = (from: number) => {
      const index = Math.round(from / step) + direction;
      return Math.min(total, Math.max(0, index * step));
    };

    if (getComputedStyle(viewport).overflowX !== "hidden") {
      viewport.scrollTo({
        left: snapped(viewport.scrollLeft),
        behavior: "smooth",
      });
      return;
    }
    // Desktop: the strip is moved by transform, so the arrow moves the same
    // property. It only appears once the pinned run is over, so nothing is
    // fighting it for control.
    const current = Math.abs(Number(gsap.getProperty(cards, "x")) || 0);
    gsap.to(cards, {
      x: -snapped(current),
      duration: 0.5,
      ease: "power2.out",
    });
  };

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const photo = photoRef.current;
    const cards = cardsRef.current;
    if (!pin || !photo || !cards) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /**
       * Arrives as a card and opens out. Deliberately not the shared CardEntry:
       * this one sits inside a pinned element, so it has to finish before the
       * pin takes over the transform and it must not fold back on the way out —
       * the pin is still holding it there. Done with clip-path on a
       * wrapper *inside* the pinned element — clipping the section from the
       * outside would cut the content away exactly when the pin holds it still,
       * and changing width or padding would move the measurements the pin
       * depends on.
       */
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const card = cardRef.current;
          if (!card) return;

          // Two custom properties rather than two clip-path strings: gsap
          // normalises `inset(0% 0% 0% 0% round 0px)` down to `inset(0%)`, and
          // interpolating between shapes of different structure is unreliable.
          // This way the string never changes, only the numbers in it.
          gsap.fromTo(
            card,
            { "--card-inset": "7%", "--card-radius": "44px", y: 56 },
            {
              "--card-inset": "0%",
              "--card-radius": "0px",
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: pin,
                start: "top 92%",
                end: "top 18%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        },
      );

      // Desktop only: the shrink-then-scroll choreography needs the horizontal
      // room, and pinning on touch devices fights the native scroll.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Measure against the width the cards column will HAVE once the photo
          // has shrunk, not its width right now — during phase 1 it is still
          // collapsing, so reading it live would give a moving target.
          const hiddenOverflow = () => {
            const finalColumnWidth =
              pin.clientWidth * (1 - PHOTO_FINAL_WIDTH / 100);
            const full = Math.max(0, cards.scrollWidth - finalColumnWidth + 48);
            // Only the first few editions slide past while the section is
            // pinned. Carrying all of them this way would hold the page for
            // something like ten screens before the regolamento came into view.
            const first = cards.firstElementChild as HTMLElement | null;
            const step = first ? first.getBoundingClientRect().width + 20 : 340;
            return Math.min(full, step * 3);
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () =>
                `+=${Math.max(window.innerHeight * 1.2, hiddenOverflow() * 1.56)}`,
              pin: true,
              // ScrollSmoother transforms the content, so the pin has to be
              // transform-based rather than position:fixed.
              pinType: "transform",
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            photo,
            { width: "100%" },
            { width: `${PHOTO_FINAL_WIDTH}%`, ease: "none", duration: 1 },
          ).to(
            cards,
            { x: () => -hiddenOverflow(), ease: "none", duration: 1.8 },
            ">",
          );
        },
      );
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinRef} className="relative lg:h-[100dvh]">
      {/* Stacked, the photo panel would just push the cards off the fold, so
          this reads as a plain section heading like the others. */}
      <div className="px-6 pt-16 sm:px-8 lg:hidden">
        <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
          Edizioni passate
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl">
          Le nostre edizioni
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed font-medium text-ink">
          Dal 2015 le vie di Valmadrera ospitano la gara, una primavera dopo
          l&apos;altra.
        </p>
      </div>

      <div
        ref={cardRef}
        className="flex h-full flex-col lg:flex-row lg:items-stretch"
        style={{
          clipPath:
            "inset(0% var(--card-inset, 0%) 0% var(--card-inset, 0%) round var(--card-radius, 0px))",
        }}
      >
        {/* Photo panel */}
        <div
          ref={photoRef}
          className="relative hidden shrink-0 lg:block lg:h-full lg:w-[42%]"
        >
          <Image
            src="/content/urban-climbing-hand.png"
            alt="Climber in azione al Valma Street Block"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/5 to-ink/75" />
          <div className="grain pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" />
          <div className="absolute right-6 bottom-8 left-6 sm:left-8">
            <p className="font-display text-3xl leading-none tracking-wide text-white sm:text-4xl lg:text-5xl">
              Dal 2015
            </p>
            <h2 className="mt-2 font-display text-4xl leading-none text-yellow sm:text-5xl lg:text-6xl">
              Le nostre
              <br />
              edizioni
            </h2>
          </div>
        </div>

        {/* Cards — free horizontal scroll on mobile, GSAP-driven on desktop */}
        <div className="relative flex min-w-0 flex-1">
          <div
            ref={viewportRef}
            className="flex min-w-0 flex-1 touch-pan-x items-center overflow-x-auto overscroll-x-contain py-8 lg:touch-auto lg:overflow-x-hidden lg:py-0"
          >
            <div
              ref={cardsRef}
              className="flex gap-5 px-6 will-change-transform sm:px-8 lg:px-12"
            >
              {editions.map((edition) => (
                <EditionThumb key={edition.id} edition={edition} />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => advance(-1)}
            aria-label="Torna alle edizioni precedenti"
            className={`absolute top-1/2 left-4 z-10 flex h-14 w-14 -translate-y-1/2 rotate-180 items-center justify-center rounded-full border border-white/70 bg-gradient-to-r from-ink/60 to-white/25 backdrop-blur-md transition-opacity duration-300 sm:left-6 ${
              showArrows ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => advance(1)}
            aria-label="Vedi le edizioni successive"
            className={`absolute top-1/2 right-4 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-gradient-to-r from-ink/60 to-white/25 backdrop-blur-md transition-opacity duration-300 sm:right-6 ${
              showArrows ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
