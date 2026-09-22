import Image from "next/image";
import { ArrowUpRight, Ticket } from "lucide-react";

import { ScrollTint } from "@/components/scroll-tint";
import { loadHowToArrive } from "@/sanity/fetch";

/* Two frames rather than one, the way the reference pairs them: a narrow
   upright beside a wide one, the same height, each under its own small label.
   The shoes are the only portrait photograph in the set, so they take the
   narrow slot. */
const PHOTOS = [
  {
    src: "/content/urban-climbing-shoes-pack.jpg",
    label: "L’attrezzatura",
    alt: "Un paio di scarpette da arrampicata appese a un moschettone azzurro, agganciate allo zaino di chi le porta",
    span: "sm:col-span-4 lg:col-span-3",
  },
  {
    src: "/content/urban-climbing-underpass.jpg",
    label: "Un blocco in paese",
    alt: "Un ragazzo appeso a due mani al soffitto di cemento di un sottopasso, con un materasso blu sotto e alcune persone che guardano da un lato",
    span: "sm:col-span-8 lg:col-span-9",
  },
] as const;

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/pill mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
    >
      {children}
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}

export async function ComeArrivareSection({
  eyebrow,
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const info = await loadHowToArrive();

  return (
    <ScrollTint
      id="come-arrivare"
      className="group page-x scroll-mt-20 py-16 sm:py-24"
    >
      {/* Heading + intro */}
      <div
        data-reveal="stagger"
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p
            data-tint-label
            className="font-mono text-sm tracking-[0.2em] text-blue uppercase"
          >
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
            {heading}
          </h2>
        </div>

        {info.intro ? (
          <p className="max-w-md text-base leading-relaxed font-medium text-ink lg:text-lg">
            {info.intro}
          </p>
        ) : null}
      </div>

      {/* One big thing and three small ones of equal weight, which is what the
          content actually is. Putting the address in a column left a hole
          beside it the width of the map that used to be there. */}
      <div data-reveal="stagger" className="mt-12 sm:mt-16">
        {info.address ? (
          <>
            {/* Labelled like the blocks below, not like a section: in the
                display face and all caps it read as a second heading, when it
                is an address. */}
            <h3 className="font-display text-lg tracking-wide text-ink">
              Ritrovo
            </h3>
            <p className="mt-3 max-w-2xl text-3xl leading-tight font-bold tracking-[-0.015em] text-ink sm:text-4xl">
              {info.address}
            </p>
            {info.mapEmbedUrl ? (
              <Pill href={info.mapEmbedUrl}>Apri in Google Maps</Pill>
            ) : null}
          </>
        ) : null}
      </div>

      {/* The ways of getting here, side by side rather than stacked in a
          column: they are alternatives, and equal widths say so. */}
      <div
        data-reveal="stagger"
        className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
      >
        {info.carInfo ? (
          <div>
            <h3 className="font-display text-lg tracking-wide text-ink">
              In auto
            </h3>
            <p className="mt-2 text-base text-ink/75">{info.carInfo}</p>
            <Pill href="https://www.google.com/maps/search/parcheggi+Valmadrera">
              Scopri i parcheggi
            </Pill>
          </div>
        ) : null}

        {info.transitInfo ? (
          <div>
            <h3 className="font-display text-lg tracking-wide text-ink">
              Con i mezzi
            </h3>
            <p className="mt-2 text-base text-ink/75">{info.transitInfo}</p>
          </div>
        ) : null}

        {/* An aside, so it waits to be looked at: on a pointer it appears when
            the section is hovered, and on a touch screen — where there is no
            hover to wait for — it is simply always there. Opacity rather than
            display, so it stays in the accessibility tree either way, and
            focus-within brings it out for anyone arriving by keyboard. */}
        {info.publicTransportInfo ? (
          <p className="flex items-start gap-2.5 self-start rounded-[2rem] rounded-tl-none bg-yellow px-4 py-3 text-base leading-snug font-semibold text-ink transition-opacity duration-300 motion-reduce:transition-none sm:col-span-2 lg:col-span-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
            <Ticket size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            {info.publicTransportInfo}
          </p>
        ) : null}
      </div>

      {/* The photographs go under the answers rather than beside them: they
          say what the place looks like, not how to reach it. */}
      <div
        data-reveal="stagger"
        className="mt-14 grid gap-5 sm:mt-20 sm:grid-cols-12 sm:gap-6"
      >
        {PHOTOS.map((photo) => (
          <figure key={photo.src} className={photo.span}>
            <figcaption
              data-tint-label
              className="font-mono text-sm tracking-[0.2em] text-blue uppercase"
            >
              {photo.label}
            </figcaption>
            <div className="relative mt-3 h-72 overflow-hidden rounded-2xl sm:h-[26rem] lg:h-[32rem]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 60vw, 92vw"
                className="object-cover"
              />
            </div>
          </figure>
        ))}
      </div>
    </ScrollTint>
  );
}
