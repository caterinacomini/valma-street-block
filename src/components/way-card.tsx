"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";

/**
 * A card in the programme's language — photograph, dark wash, type at the foot
 * — with its label set above rather than inside, so a row of them reads as
 * labelled rather than as posters.
 *
 * The note is one element, not two: on a pointer it lifts out of the flow and
 * trails the cursor across the card, and on a touch screen — where there is no
 * cursor to trail and no hover to wait for — it sits under the card and stays.
 * Rendering both and hiding one would have said it twice to a screen reader.
 *
 * It is a sibling of the card rather than a child of it. Inside, a static
 * element sits below every positioned one in the paint order, so on a phone it
 * was rendering underneath the photograph — present, correct, and invisible.
 */
export function WayCard({
  label,
  photo,
  alt,
  body,
  action,
  note,
  span = "",
  height = "h-[26rem] sm:h-[30rem]",
}: {
  label: string;
  photo: string;
  alt: string;
  body?: string;
  action?: { href: string; text: string };
  note?: React.ReactNode;
  span?: string;
  height?: string;
}) {
  const figure = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const trailing = useRef<HTMLDivElement>(null);

  const follow = (event: React.MouseEvent) => {
    const outer = figure.current;
    const box = frame.current;
    const el = trailing.current;
    if (!outer || !box || !el || !window.matchMedia("(hover: hover)").matches) return;

    /* Positioned against the figure but kept within the card, so the offsets
       are measured from one and clamped by the other. Nudged clear of the
       cursor so the pointer never sits on top of the words. */
    const o = outer.getBoundingClientRect();
    const r = box.getBoundingClientRect();
    const minX = r.left - o.left + 12;
    const minY = r.top - o.top + 12;
    const x = Math.min(Math.max(event.clientX - o.left + 18, minX), minX + r.width - el.offsetWidth - 24);
    const y = Math.min(Math.max(event.clientY - o.top + 18, minY), minY + r.height - el.offsetHeight - 24);
    gsap.to(el, { x, y, duration: 0.45, ease: "power3.out", overwrite: true });
  };

  return (
    <figure ref={figure} className={`group/card relative flex flex-col ${span}`}>
      <figcaption className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
        {label}
      </figcaption>

      <div
        ref={frame}
        onMouseMove={note ? follow : undefined}
        className={`relative mt-3 flex ${height} flex-col justify-end overflow-hidden rounded-3xl bg-ink px-5 py-5 text-white sm:px-6 sm:py-6`}
      >
        <Image
          src={photo}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 40vw, 92vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
        <div className="grain pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" />

        {/* Kept out of the page tint: the card is dark whatever the page is
            doing, so its type stays white on both grounds. */}
        <div className="relative">
          {body ? (
            <p className="max-w-md text-base leading-relaxed text-white/90">
              {body}
            </p>
          ) : null}
          {action ? (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/pill mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
            >
              {action.text}
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5 motion-reduce:transition-none"
              />
            </a>
          ) : null}
        </div>

      </div>

      {note ? (
        <div ref={trailing} className="trailing-note">
          {note}
        </div>
      ) : null}
    </figure>
  );
}
