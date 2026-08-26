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

  const frames = edition.frames.length > 0 ? edition.frames : [edition.coverUrl];

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
      className="group relative aspect-[3/4] w-72 shrink-0 overflow-hidden rounded-3xl bg-ink sm:w-80 lg:w-[22rem]"
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
            <span className="h-2 w-2 shrink-0 rounded-full bg-yellow" />
            +{edition.participantsCount} climbers
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

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const photo = photoRef.current;
    const cards = cardsRef.current;
    if (!pin || !photo || !cards) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

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
            return Math.max(0, cards.scrollWidth - finalColumnWidth + 48);
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${window.innerHeight * 2.4}`,
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
      <div className="flex h-full flex-col lg:flex-row lg:items-stretch">
        {/* Photo panel */}
        <div
          ref={photoRef}
          className="relative h-72 shrink-0 sm:h-96 lg:h-full lg:w-[42%]"
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
          <div className="absolute top-6 left-6 font-mono text-xs tracking-[0.2em] text-white uppercase sm:left-8">
            Edizioni passate
          </div>
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
        <div className="flex min-w-0 flex-1 touch-pan-x items-center overflow-x-auto overscroll-x-contain py-8 lg:touch-auto lg:overflow-x-hidden lg:py-0">
          <div
            ref={cardsRef}
            className="flex gap-5 px-6 will-change-transform sm:px-8 lg:px-12"
          >
            {editions.map((edition) => (
              <EditionThumb key={edition.id} edition={edition} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
