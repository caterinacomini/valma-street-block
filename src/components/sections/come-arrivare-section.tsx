import { ArrowUpRight, Ticket } from "lucide-react";

import { loadHowToArrive } from "@/sanity/fetch";

/** Filled pill, ranged left, set in the site's own voice rather than caps. */
function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue"
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

/** A labelled block: a dashed rule, then the site's own heading face. */
function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-dashed border-ink/25 pt-6 sm:pt-8">
      <h3 className="font-display text-lg tracking-wide text-ink">{label}</h3>
      {children}
    </div>
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
    <section id="come-arrivare" className="scroll-mt-20 py-16 sm:py-24">
      <div className="page-x">
        <p
          data-reveal
          className="font-mono text-sm tracking-[0.2em] text-blue uppercase"
        >
          {eyebrow}
        </p>
      </div>

      {/* The rules run the full width rather than stopping at the text column:
          they are the section's edges, not an underline. */}
      <div className="rule-dotted mt-5 text-ink/30 sm:mt-6" />

      <h2
        data-reveal
        className="page-x py-5 font-display text-4xl leading-none text-ink sm:py-7 sm:text-5xl lg:text-6xl"
      >
        {heading}
      </h2>

      <div className="rule-dotted text-ink/30" />

      <div
        data-reveal="stagger"
        className="page-x mt-10 sm:mt-14 lg:grid lg:grid-cols-12 lg:gap-12"
      >
        {/* Where it is. Set in the body face, not the display one: under a blue
            label and in Koulen it read as a second section heading. */}
        <div className="lg:col-span-7">
          <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
            Ritrovo
          </p>
          {info.address ? (
            <p className="mt-3 max-w-2xl text-2xl leading-tight font-medium text-ink sm:text-3xl">
              {info.address}
            </p>
          ) : null}
          {info.intro ? (
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">
              {info.intro}
            </p>
          ) : null}
          {info.mapEmbedUrl ? (
            <Pill href={info.mapEmbedUrl}>Apri in Google Maps</Pill>
          ) : null}
        </div>

        {/* How you get there, and the reason to come without a car. */}
        <div className="mt-12 flex flex-col gap-8 sm:mt-16 sm:gap-10 lg:col-span-5 lg:mt-1">
          {info.carInfo ? (
            <Block label="In auto">
              <p className="mt-2 text-base text-ink/75">{info.carInfo}</p>
              <Pill href="https://www.google.com/maps/search/parcheggi+Valmadrera">
                Scopri i parcheggi
              </Pill>
            </Block>
          ) : null}

          {info.transitInfo ? (
            <Block label="Con i mezzi">
              <p className="mt-2 text-base text-ink/75">{info.transitInfo}</p>
              <Pill href="https://www.trenord.it">Orari dei treni</Pill>
            </Block>
          ) : null}

          {/* Not a direction but a reason, so it keeps its yellow and stays
              outside the run of labelled blocks. */}
          {info.publicTransportInfo ? (
            <p className="flex items-start gap-2.5 rounded-3xl bg-yellow px-5 py-4 text-sm leading-snug font-semibold text-ink">
              <Ticket size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              {info.publicTransportInfo}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
