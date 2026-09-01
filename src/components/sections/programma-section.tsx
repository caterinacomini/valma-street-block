import Image from "next/image";
import { MapPin } from "lucide-react";

import { photoProps } from "@/sanity/image";
import { loadProgramItems } from "@/sanity/fetch";

/**
 * What a programme is: a list of times. Said as a list, then — rows separated
 * by dotted rules, the hour set as large as the title, and the detail in tight
 * caps underneath. The expanding cards over photographs belonged to the old
 * language, where a photograph was always a background.
 *
 * Built narrow first: one column of rows on a phone, the photograph band
 * arriving only when there is room for it to mean something.
 */
export async function ProgrammaSection({
  eyebrow,
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const items = await loadProgramItems();

  return (
    <section id="programma" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
      <div className="page-x">
        <p
          data-reveal
          className="text-xs font-bold tracking-[0.22em] text-blue uppercase sm:text-sm"
        >
          {eyebrow}
        </p>
      </div>

      <div className="rule-dotted mt-6 text-ink/35 sm:mt-8" />

      <h2
        data-reveal
        className="page-x py-6 font-sans text-[10.5vw] leading-[0.92] font-bold tracking-[-0.035em] text-ink uppercase sm:py-8 lg:text-[7.6vw]"
      >
        {heading}
      </h2>

      <div className="rule-dotted text-ink/35" />

      <ol data-reveal="stagger" className="page-x">
        {items.map((item, i) => {
          const photo = photoProps(
            item.image,
            { src: "", className: "object-cover", alt: "" },
            900,
          );
          return (
            <li
              key={item._id}
              className="grid gap-4 border-b border-dashed border-ink/25 py-8 last:border-b-0 sm:py-10 lg:grid-cols-12 lg:items-start lg:gap-8"
            >
              <p className="font-sans text-[9vw] leading-[0.9] font-bold tracking-[-0.03em] text-blue lg:col-span-3 lg:text-[3.4vw]">
                {item.time}
                {item.endTime ? (
                  <span className="block text-ink/35">{item.endTime}</span>
                ) : null}
              </p>

              <div className="lg:col-span-5">
                <h3 className="font-sans text-[7vw] leading-[0.95] font-bold tracking-[-0.03em] text-ink uppercase lg:text-[2.6vw]">
                  {item.title}
                </h3>
                {item.location ? (
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-ink/50 uppercase">
                    <MapPin size={13} aria-hidden="true" />
                    {item.location}
                  </p>
                ) : null}
                {item.description ? (
                  <p className="mt-4 max-w-md text-xs leading-relaxed font-bold tracking-[0.05em] text-ink/70 uppercase sm:text-sm">
                    {item.description}
                  </p>
                ) : null}
              </div>

              {photo.src ? (
                <div
                  className={`relative aspect-[4/3] overflow-hidden lg:col-span-4 lg:aspect-[5/4] ${
                    i % 2 ? "lg:-rotate-1" : "lg:rotate-1"
                  }`}
                >
                  <Image
                    {...photo}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 92vw"
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
