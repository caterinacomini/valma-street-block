import { ArrowUpRight, Ticket } from "lucide-react";

import { loadHowToArrive } from "@/sanity/fetch";

/** Filled pill, ranged left: the shape this language uses for every link. */
function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11px] font-bold tracking-[0.14em] text-white uppercase transition hover:bg-blue sm:text-xs"
    >
      {children}
      <ArrowUpRight
        size={14}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}

/** A labelled block: a dashed rule, a small blue label, then the answer. */
function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-dashed border-ink/25 pt-6 sm:pt-8">
      <p className="text-[11px] font-bold tracking-[0.2em] text-blue uppercase sm:text-xs">
        {label}
      </p>
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

  const body =
    "text-xs leading-relaxed font-bold tracking-[0.05em] text-ink uppercase sm:text-sm";

  return (
    <section id="come-arrivare" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
      <div className="page-x">
        <p
          data-reveal
          className="text-xs font-bold tracking-[0.22em] text-blue uppercase sm:text-sm"
        >
          {eyebrow}
        </p>
      </div>

      {/* The rules run the full width rather than stopping at the text column:
          they are the section's edges, not an underline. */}
      <div className="rule-dotted mt-6 text-ink/35 sm:mt-8" />

      <h2
        data-reveal
        className="page-x py-6 font-sans text-[10.5vw] leading-[0.92] font-bold tracking-[-0.035em] text-ink uppercase sm:py-8 lg:text-[7.6vw]"
      >
        {heading}
      </h2>

      <div className="rule-dotted text-ink/35" />

      <div
        data-reveal="stagger"
        className="page-x mt-10 sm:mt-14 lg:grid lg:grid-cols-12 lg:gap-12"
      >
        {/* Where it is. Said once, at the size that makes it the answer. */}
        <div className="lg:col-span-7">
          <p className="text-[11px] font-bold tracking-[0.2em] text-blue uppercase sm:text-xs">
            Ritrovo
          </p>
          {info.address ? (
            <p className="mt-3 font-sans text-[9vw] leading-[0.94] font-bold tracking-[-0.03em] text-ink uppercase lg:text-[4.2vw]">
              {info.address}
            </p>
          ) : null}
          {info.intro ? (
            <p className={`mt-5 max-w-md ${body} text-ink/70`}>{info.intro}</p>
          ) : null}
          {info.mapEmbedUrl ? (
            <Pill href={info.mapEmbedUrl}>Apri in Google Maps</Pill>
          ) : null}
        </div>

        {/* How you get there, and the reason to come without a car. */}
        <div className="mt-12 flex flex-col gap-8 sm:mt-16 sm:gap-10 lg:col-span-5 lg:mt-2">
          {info.carInfo ? (
            <Block label="In auto">
              <p className={`mt-3 ${body}`}>{info.carInfo}</p>
              <Pill href="https://www.google.com/maps/search/parcheggi+Valmadrera">
                Scopri i parcheggi
              </Pill>
            </Block>
          ) : null}

          {info.transitInfo ? (
            <Block label="Con i mezzi">
              <p className={`mt-3 ${body}`}>{info.transitInfo}</p>
              <Pill href="https://www.trenord.it">Orari dei treni</Pill>
            </Block>
          ) : null}

          {/* Not a direction but a reason, so it keeps its yellow and stays
              outside the run of labelled blocks. */}
          {info.publicTransportInfo ? (
            <p className="flex items-start gap-2.5 rounded-3xl bg-yellow px-5 py-4 text-[11px] leading-relaxed font-bold tracking-[0.05em] text-ink uppercase sm:text-xs">
              <Ticket size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              {info.publicTransportInfo}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
