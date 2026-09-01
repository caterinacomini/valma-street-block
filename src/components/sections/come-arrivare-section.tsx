import { ArrowUpRight } from "lucide-react";

import { loadHowToArrive } from "@/sanity/fetch";

/** Pill link, ranged left, the shape the reference uses for everything. */
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

/** A labelled block: small caps label, then the answer. */
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

      <div className="rule-dotted mt-6 text-ink/35 sm:mt-8" />

      <h2
        data-reveal
        className="page-x py-6 font-sans text-[10.5vw] leading-[0.92] font-bold tracking-[-0.035em] text-ink uppercase sm:py-8 lg:text-[7.6vw]"
      >
        {heading}
      </h2>

      <div className="rule-dotted text-ink/35" />

      {/* The address is the answer to the question the section asks, so it is
          said once, at display size, and never again. Everything below adds
          something the address does not already say. */}
      <div data-reveal="stagger" className="page-x mt-10 sm:mt-14">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold tracking-[0.2em] text-blue uppercase sm:text-xs">
              Ritrovo
            </p>
            <p className="mt-3 font-sans text-[9vw] leading-[0.94] font-bold tracking-[-0.03em] text-ink uppercase lg:text-[4.2vw]">
              {info.address}
            </p>
            {info.intro ? (
              <p className="mt-5 max-w-md text-xs leading-relaxed font-bold tracking-[0.06em] text-ink/70 uppercase sm:text-sm">
                {info.intro}
              </p>
            ) : null}
            {info.mapEmbedUrl ? (
              <Pill href={info.mapEmbedUrl}>Apri in Google Maps</Pill>
            ) : null}
          </div>

          {/* The two ways of getting there, each stated once. */}
          <div className="mt-12 flex flex-col gap-8 sm:mt-16 sm:gap-10 lg:col-span-5 lg:mt-2">
            {info.carInfo ? (
              <Block label="In auto">
                <p className="mt-3 text-xs leading-relaxed font-bold tracking-[0.05em] text-ink uppercase sm:text-sm">
                  {info.carInfo}
                </p>
                <Pill href="https://www.google.com/maps/search/parcheggi+Valmadrera">
                  Scopri i parcheggi
                </Pill>
              </Block>
            ) : null}

            {info.publicTransportInfo ? (
              <Block label="Se vieni coi mezzi">
                <p className="mt-3 text-xs leading-relaxed font-bold tracking-[0.05em] text-ink uppercase sm:text-sm">
                  {info.publicTransportInfo}
                </p>
              </Block>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
