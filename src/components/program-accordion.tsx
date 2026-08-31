"use client";

import Image from "next/image";
import { useState } from "react";

import { photoProps } from "@/sanity/image";
import type { ProgramItem } from "@/sanity/types";

/**
 * What a card shows before anybody has attached a photograph to it in the
 * Studio. Assigned by position, so the four moments of the day keep the framing
 * each of these was chosen for; an item with its own photograph ignores them.
 */
const BACKDROPS = [
  { src: "/content/urban-climbing-shoes-pack.jpg", pos: "object-center" },
  { src: "/content/urban-climbing-bench-full.jpg", pos: "object-[25%_45%]" },
  { src: "/content/urban-climbing-hero.png", pos: "object-[center_35%]" },
  { src: "/content/urban-climbing-beam.png", pos: "object-[center_45%]" },
];

/**
 * The essentials — when, and what happens — stay on the face of every card,
 * open or shut. Only the detail is folded away, so a closed list still answers
 * the question the section exists to answer.
 */
export function ProgramAccordion({ items }: { items: ProgramItem[] }) {
  const [openId, setOpenId] = useState(items[0]?._id);

  return (
    <ul className="flex flex-col gap-3 lg:h-[70dvh] lg:flex-row lg:gap-4">
      {items.map((item, index) => {
        const open = item._id === openId;
        const hasDetail = Boolean(item.location || item.description);
        const local = BACKDROPS[index % BACKDROPS.length];
        const photo = photoProps(
          item.image,
          { src: local.src, className: `object-cover ${local.pos}`, alt: "" },
          1200,
        );

        return (
          <li
            key={item._id}
            className={`min-w-0 transition-all duration-500 ease-out lg:h-full lg:basis-0 ${
              open ? "h-[340px] lg:grow-[2.6]" : "h-28 lg:grow"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(item._id)}
              aria-expanded={open}
              className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-3xl bg-ink px-5 py-5 text-left text-white sm:px-6 sm:py-6"
            >
              <Image
                {...photo}
                alt={photo.alt}
                fill
                className={`${photo.className} transition-transform duration-700 group-hover:scale-[1.04]`}
                sizes="(min-width: 1024px) 520px, 92vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-ink/20" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
              <div className="grain pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" />

              {/* Always on the face of the card */}
              <p className="relative font-display text-2xl leading-none sm:text-3xl">
                {item.time}
                {item.endTime ? (
                  <span className="text-white/55"> – {item.endTime}</span>
                ) : null}
              </p>
              <h3 className="relative mt-1.5 font-display text-xl tracking-wide sm:text-2xl">
                {item.title}
              </h3>

              {/* Folded away until asked for */}
              {hasDetail ? (
                <div
                  className={`relative grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                    open
                      ? "mt-2.5 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {item.location ? (
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-white/85">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="shrink-0"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {item.location}
                      </p>
                    ) : null}
                    {item.description ? (
                      <p className="mt-1.5 max-w-sm text-sm text-white/75">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
