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

      {/* Without the drawn route the address has to carry the section, so it is
          set at display size and said once. The two ways of getting there sit
          beside it rather than under a map that is no longer there. */}
      <div
        data-reveal="stagger"
        className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12"
      >
        {info.address ? (
          <div className="lg:col-span-7">
            <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
              Ritrovo
            </p>
            <p className="mt-3 font-display text-3xl leading-[0.95] text-ink uppercase sm:text-4xl lg:text-5xl">
              {info.address}
            </p>
            {info.mapEmbedUrl ? (
              <Pill href={info.mapEmbedUrl}>Apri in Google Maps</Pill>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-10 lg:col-span-5 lg:flex-col lg:gap-8">
          {info.carInfo ? (
            <div className="flex-1">
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
            <div className="flex-1">
              <h3 className="font-display text-lg tracking-wide text-ink">
                Con i mezzi
              </h3>
              <p className="mt-2 text-base text-ink/75">{info.transitInfo}</p>
              <Pill href="https://www.trenord.it">Orari dei treni</Pill>
            </div>
          ) : null}

          {/* Not a direction but a reason, so it is set apart as a note rather
              than a third way of getting here. */}
          {info.publicTransportInfo ? (
            <p className="inline-flex items-start gap-2.5 rounded-3xl bg-yellow px-5 py-3 text-sm leading-snug font-semibold text-ink sm:items-center">
              <Ticket
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 sm:mt-0"
              />
              {info.publicTransportInfo}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
