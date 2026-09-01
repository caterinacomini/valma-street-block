import { ArrowUpRight, Ticket } from "lucide-react";

import { loadHowToArrive } from "@/sanity/fetch";

/** Outline pill, the shape this design uses for every secondary link. */
function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
    >
      {children}
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
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
    <section id="come-arrivare" className="page-x scroll-mt-20 py-16 sm:py-24">
      {/* Heading + intro */}
      <div
        data-reveal="stagger"
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
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
            <p className="mt-2 max-w-2xl text-2xl leading-tight font-medium text-ink sm:text-3xl">
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
            <Pill href="https://www.trenord.it">Orari dei treni</Pill>
          </div>
        ) : null}

        {/* Not a third way but a reason, so it is a note and not a column of
            prose — and it spans the pair while there are only two of them. */}
        {info.publicTransportInfo ? (
          <p className="flex items-start gap-2.5 self-start rounded-3xl bg-yellow px-5 py-4 text-sm leading-snug font-semibold text-ink sm:col-span-2 lg:col-span-1">
            <Ticket size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            {info.publicTransportInfo}
          </p>
        ) : null}
      </div>
    </section>
  );
}
