import { ArrowUpRight } from "lucide-react";

import { ArrivalMap } from "@/components/arrival-map";
import { ArrivalMapMobile } from "@/components/arrival-map-mobile";
import { loadHowToArrive } from "@/sanity/fetch";

/** Pill link, ranged left, the shape the reference uses for everything. */
function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11px] font-bold tracking-[0.14em] text-white uppercase transition hover:bg-blue sm:text-xs"
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

export async function ComeArrivareSection({
  eyebrow,
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const info = await loadHowToArrive();

  const details = [
    { title: "Punto di ritrovo", body: info.address, pill: info.mapEmbedUrl ? { href: info.mapEmbedUrl, label: "Apri in Google Maps" } : null },
    { title: "In auto", body: info.carInfo, pill: { href: "https://www.google.com/maps/search/parcheggi+Valmadrera", label: "Scopri i parcheggi" } },
    { title: "Con i mezzi", body: info.publicTransportInfo, pill: null },
  ].filter((d) => d.body);

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

      {info.intro ? (
        <div className="page-x mt-8 sm:mt-10">
          <p className="max-w-xl text-xs leading-relaxed font-bold tracking-[0.06em] text-ink uppercase sm:text-sm">
            {info.intro}
          </p>
        </div>
      ) : null}

      {/* The route keeps its two shapes: wide and side to side once there is
          room, vertical and scroll-driven when there is not. */}
      <div className="page-x mt-12 lg:mt-16">
        <div className="lg:hidden">
          <ArrivalMapMobile />
        </div>
        <div className="hidden lg:block">
          <ArrivalMap />
        </div>
      </div>

      {/* Three answers, stacked on a phone and split by dashed rules rather
          than sitting in columns that only exist on a laptop. */}
      <div data-reveal="stagger" className="page-x mt-12 sm:mt-16 lg:grid lg:grid-cols-3 lg:gap-10">
        {details.map((detail) => (
          <div
            key={detail.title}
            className="border-t border-dashed border-ink/25 py-8 lg:border-t-0 lg:py-0"
          >
            <h3 className="font-sans text-[6vw] leading-[0.95] font-bold tracking-[-0.02em] text-ink uppercase sm:text-2xl lg:text-[1.9vw]">
              {detail.title}
            </h3>
            <p className="mt-3 max-w-sm text-xs leading-relaxed font-bold tracking-[0.05em] text-ink/70 uppercase sm:text-sm">
              {detail.body}
            </p>
            {detail.pill ? (
              <Pill href={detail.pill.href}>{detail.pill.label}</Pill>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
