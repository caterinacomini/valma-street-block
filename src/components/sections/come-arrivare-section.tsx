import { ArrowUpRight, Ticket } from "lucide-react";

import { ScrollTint } from "@/components/scroll-tint";
import { WayCard } from "@/components/way-card";
import { loadHowToArrive } from "@/sanity/fetch";

/** Outline pill on the page's own ground. */
function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/pill mt-5 inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
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
      <div data-reveal="stagger">
        <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
          {heading}
        </h2>
      </div>

      {/* Where it is, and what it is, together: the line about the gara used to
          sit off on the right beside the heading, a screen away from the
          address it describes. */}
      <div data-reveal="stagger" className="mt-7 sm:mt-9">
        {info.address ? (
          <>
            <p className="max-w-2xl text-3xl leading-tight font-bold tracking-[-0.015em] text-ink sm:text-4xl">
              {info.address}
            </p>
            {info.intro ? (
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">
                {info.intro}
              </p>
            ) : null}
            {info.mapEmbedUrl ? (
              <Pill href={info.mapEmbedUrl}>Apri in Google Maps</Pill>
            ) : null}
          </>
        ) : null}
      </div>

      {/* The two ways, as a labelled pair. */}
      <div
        data-reveal="stagger"
        className="mt-14 grid items-start gap-6 sm:mt-20 lg:grid-cols-12 lg:gap-8"
      >
        {info.carInfo ? (
          <WayCard
            label="In auto"
            /* Taller and narrower than its neighbour: the aerial is an upright
               photograph, and half the row cropped the valley away. */
            span="lg:col-span-4"
            height="h-[28rem] sm:h-[36rem] lg:h-[40rem]"
            photo="/content/strada.jpg"
            alt="Veduta dall'alto dei laghi di Annone e Oggiono, con la statale che corre lungo la riva e il paese sul fianco della valle"
            body={info.carInfo}
            action={{
              href: "https://www.google.com/maps/search/parcheggi+Valmadrera",
              text: "Scopri i parcheggi",
            }}
          />
        ) : null}

        {info.transitInfo ? (
          <WayCard
            label="Con i mezzi"
            span="lg:col-span-8"
            height="h-[28rem] sm:h-[36rem] lg:h-[40rem]"
            photo="/content/urban-climbing-shoes-pack.jpg"
            alt="Un paio di scarpette da arrampicata appese a un moschettone azzurro, agganciate allo zaino di chi le porta"
            body={info.transitInfo}
            note={
              info.publicTransportInfo ? (
                /* Hung off this card rather than the whole section: the offer
                   is for whoever arrives by train or bus, so it answers to the
                   card that talks to them. Opacity rather than display, so it
                   stays in the accessibility tree; focus-within brings it out
                   for anyone arriving by keyboard; and on a touch screen,
                   where there is no hover to wait for, it is simply there. */
                <p className="tint-keep inline-flex w-fit items-start gap-2.5 rounded-[2rem] rounded-tl-none bg-yellow px-4 py-2.5 text-base leading-snug font-semibold text-ink">
                  <Ticket
                    size={19}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                  />
                  {info.publicTransportInfo}
                </p>
              ) : null
            }
          />
        ) : null}
      </div>

    </ScrollTint>
  );
}
