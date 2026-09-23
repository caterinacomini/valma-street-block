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
 * cursor to trail and no hover to wait for — it simply sits under the card and
 * stays. Rendering both and hiding one would have said it twice to a screen
 * reader.
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
  const frame = useRef<HTMLDivElement>(null);
  const trailing = useRef<HTMLDivElement>(null);

  const follow = (event: React.MouseEvent) => {
    const box = frame.current;
    const el = trailing.current;
    if (!box || !el || !window.matchMedia("(hover: hover)").matches) return;

    const r = box.getBoundingClientRect();
    /* Kept inside the card, and nudged clear of the cursor itself so the
       pointer is never sitting on top of the words. */
    const x = Math.min(Math.max(event.clientX - r.left + 18, 12), r.width - el.offsetWidth - 12);
    const y = Math.min(Math.max(event.clientY - r.top + 18, 12), r.height - el.offsetHeight - 12);
    gsap.to(el, { x, y, duration: 0.45, ease: "power3.out", overwrite: true });
  };

  return (
    <figure className={`group/card flex flex-col ${span}`}>
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

        {note ? (
          <div ref={trailing} className="trailing-note">
            {note}
          </div>
        ) : null}
      </div>
    </figure>
  );
}
