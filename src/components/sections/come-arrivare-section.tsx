import Image from "next/image";
import { ArrowUpRight, Ticket } from "lucide-react";

import { ScrollTint } from "@/components/scroll-tint";
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

/**
 * A card in the programme's language — photograph, dark wash, type at the foot
 * — but with its label set above rather than inside, so the two read as a
 * labelled pair rather than two posters.
 */
function WayCard({
  label,
  photo,
  alt,
  body,
  action,
}: {
  label: string;
  photo: string;
  alt: string;
  body?: string;
  action?: { href: string; text: string };
}) {
  return (
    <figure className="flex flex-col">
      <figcaption className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
        {label}
      </figcaption>

      <div className="relative mt-3 flex h-[26rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink px-5 py-5 text-white sm:h-[30rem] sm:px-6 sm:py-6">
        <Image
          src={photo}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 45vw, 92vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
        <div className="grain pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" />

        {/* Kept out of the tint: the card is dark whatever the page is doing,
            so its type stays white on both grounds. */}
        <div className="relative">
          {body ? (
            <p className="max-w-md text-base leading-relaxed text-white/90">
              {body}
            </p>
          ) : null}
          {action ? (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/pill mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
            >
              {action.text}
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5 motion-reduce:transition-none"
              />
            </a>
          ) : null}
        </div>
      </div>
    </figure>
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
      <div data-reveal="stagger" className="mt-12 sm:mt-16">
        {info.address ? (
          <>
            <h3 className="font-display text-lg tracking-wide text-ink">
              Ritrovo
            </h3>
            <p className="mt-3 max-w-2xl text-3xl leading-tight font-bold tracking-[-0.015em] text-ink sm:text-4xl">
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
        className="mt-14 grid gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8"
      >
        {info.carInfo ? (
          <WayCard
            label="In auto"
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
            photo="/content/urban-climbing-shoes-pack.jpg"
            alt="Un paio di scarpette da arrampicata appese a un moschettone azzurro, agganciate allo zaino di chi le porta"
            body={info.transitInfo}
          />
        ) : null}
      </div>

      {/* An aside, so it waits to be looked at: on a pointer it appears when
          the section is hovered, and on a touch screen — where there is no
          hover to wait for — it is simply always there. Opacity rather than
          display, so it stays in the accessibility tree either way, and
          focus-within brings it out for anyone arriving by keyboard. */}
      {info.publicTransportInfo ? (
        <p className="tint-keep mt-8 flex max-w-xl items-start gap-2.5 rounded-[2rem] rounded-tl-none bg-yellow px-4 py-3 text-base leading-snug font-semibold text-ink transition-opacity duration-300 motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100">
          <Ticket size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          {info.publicTransportInfo}
        </p>
      ) : null}
    </ScrollTint>
  );
}
