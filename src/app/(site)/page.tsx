import Image from "next/image";
import { draftMode } from "next/headers";
import { Fragment, type ReactNode } from "react";

import { CardEntry } from "@/components/card-entry";
import { RegisterButton } from "@/components/register-button";
import { ComeArrivareSection } from "@/components/sections/come-arrivare-section";
import { EdizioniPassateSection } from "@/components/sections/edizioni-passate-section";
import { ProgrammaSection } from "@/components/sections/programma-section";
import { RegolamentoSection } from "@/components/sections/regolamento-section";
import { SponsorSection } from "@/components/sections/sponsor-section";
import { formatDateIt } from "@/lib/format";
import { resolveSections, type SectionId } from "@/lib/sections";
import {
  loadHomeContent,
  loadPastEditions,
  loadSiteSettings,
} from "@/sanity/fetch";
import { fieldAttr } from "@/sanity/data-attribute";
import { heroPhotoProps, photoProps } from "@/sanity/image";

/**
 * Re-fetch content from Sanity at most once a minute. Without this the page is
 * baked at build time, so publishing in the Studio would not reach the site
 * until the next deploy.
 */
export const revalidate = 60;

/**
 * The four sections an editor can reorder. Kept as elements rather than
 * components so the order below is a list to walk, not a switch to maintain.
 */
const SECTIONS: Record<
  SectionId,
  (props: { eyebrow?: string; heading?: string }) => ReactNode
> = {
  programma: (p) => <ProgrammaSection {...p} />,
  comeArrivare: (p) => <ComeArrivareSection {...p} />,
  edizioniPassate: (p) => <EdizioniPassateSection {...p} />,
  regolamento: (p) => <RegolamentoSection {...p} />,
};

/**
 * Photo card on the hero's recipe: a light progressive blur rising from the
 * bottom, black grain over it, type bottom-left.
 *
 * Type is sized in fixed steps rather than container units on purpose: stacked,
 * all three cards are the same width, and proportional sizing gave the wide one
 * a much smaller title than the square ones. Stacked they also share one aspect
 * ratio, so the heights match; side by side each shape goes its own way.
 */
export default async function HomePage() {
  const { isEnabled: preview } = await draftMode();
  const [settings, pastEditions, home] = await Promise.all([
    loadSiteSettings(),
    loadPastEditions(),
    loadHomeContent(),
  ]);

  const lastEdition = pastEditions[0];
  /* The file in /public keeps its own object-position classes: those were
     tuned per breakpoint, and a hotspot is a single point for every width. */
  const heroPhoto = heroPhotoProps(
    settings.heroImage,
    {
      src: "/content/urban-climbing-bridge-dyno.jpg",
      className:
        "object-cover object-[80%_45%] sm:object-[65%_45%] lg:object-[center_45%]",
      alt: "Passaggio in dinamico sotto il ponte durante il Valma Street Block",
    },
    3200,
  );

  /* Four square crops. Each falls back to the file it was framed with, since a
     hotspot cannot reproduce a per-photo object-position that was chosen by eye. */
  const introPhotos = [
    { src: "/content/urban-climbing-bench-detail.jpg", pos: "object-center" },
    { src: "/content/urban-climbing-wall-kid.jpg", pos: "object-[center_30%]" },
    { src: "/content/urban-climbing-hand.png", pos: "object-center" },
    { src: "/content/urban-climbing-1.png", pos: "object-[center_25%]" },
  ].map((local, i) =>
    photoProps(
      home.introPhotos?.[i],
      { src: local.src, className: `object-cover ${local.pos}`, alt: "" },
      640,
    ),
  );

  /* The first number follows the most recent edition until someone overrides it
     in the Studio, which is why this fallback lives here and not in fetch.ts. */
  const stats = home.stats?.length
    ? home.stats
    : [
        {
          value: `+${lastEdition?.participantsCount ?? 470} climbers`,
          label: "In gara all'ultima edizione, competitivi e non.",
        },
        {
          value: "+50 blocchi",
          label: "Passaggi brevi ma intensi, sparsi per il paese.",
        },
      ];

  const closingPhoto = photoProps(
    home.closingImage,
    {
      src: "/content/urban-climbing-underpass.jpg",
      className: "object-cover object-[center_45%]",
      alt: "Salto nel sottopasso durante il Valma Street Block",
    },
    2400,
  );
  const formattedDate = formatDateIt(settings.eventDate);
  /* A postponement is a state, not a permanent field: until the switch is
     thrown there is nothing to say. The original date stays on the page, struck
     through, because people arrive holding it in their heads. */
  const newDate = formatDateIt(settings.rainDate);
  const postponed = Boolean(settings.postponed);

  return (
    <>
      <section
        id="top"
        className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink"
      >
        <Image {...heroPhoto} alt={heroPhoto.alt} fill priority sizes="100vw" />
        {/* Progressive blur (0 → 9px) fading in toward the bottom-left, where the copy sits.
            Stacked layers because CSS has no native progressive backdrop-filter. */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_bottom_left,transparent_34%,black_54%)]" />
          <div className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom_left,transparent_51%,black_71%)]" />
          <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom_left,transparent_67%,black_87%)]" />
          <div className="absolute inset-0 backdrop-blur-[9px] [mask-image:linear-gradient(to_bottom_left,transparent_82%,black_98%)]" />
        </div>
        {/* Film grain */}
        <div className="grain pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" />

        <div className="page-x relative flex flex-1 flex-col justify-end pt-24 pb-8 sm:pt-28 lg:pb-14">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="font-display text-[21vw] leading-[0.82] text-yellow sm:text-[16vw] lg:text-[12.5vw]">
              VALMA
              <br />
              STREET
              <br />
              <span className="relative inline-block">
                BLOCK
                {settings.editionNumber ? (
                  <span className="absolute -top-[1.5vw] -right-[10vw] -rotate-[10deg] rounded-full border-2 border-yellow bg-ink px-[2vw] py-[0.9vw] font-sans text-[clamp(0.6rem,2.4vw,1.35rem)] leading-tight font-bold whitespace-nowrap text-yellow uppercase sm:-right-[8vw] sm:px-[1.6vw] sm:py-[0.7vw] lg:-top-[1vw] lg:-right-[6vw] lg:px-[1.2vw] lg:py-[0.5vw] lg:text-[clamp(0.75rem,1.15vw,1.5rem)]">
                    {settings.editionNumber}ª edizione
                  </span>
                ) : null}
              </span>
            </h1>

            <div className="flex max-w-xs flex-col items-start gap-4 pb-1 sm:max-w-sm lg:pb-4">
              <p
                className="font-display text-2xl leading-tight tracking-wide text-white sm:text-3xl"
                data-sanity={fieldAttr(preview, "siteSettings", "siteSettings", "eventDate")}
              >
                {postponed && formattedDate ? (
                  /* <s> so the cancellation reaches a screen reader too; the
                     default underline is swapped for a drawn diagonal. */
                  <s className="relative inline-block [text-decoration:none]">
                    {formattedDate}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-[-6%] top-1/2 h-[5px] -rotate-[7deg] rounded-full bg-blue"
                    />
                  </s>
                ) : (
                  (formattedDate ?? "Data da definire")
                )}
                <span className="block">{settings.location}</span>
              </p>

              {postponed ? (
                <p className="-rotate-[3deg] rounded-2xl bg-blue px-5 py-3 font-sans text-base leading-tight font-bold tracking-wide text-ink uppercase shadow-lg sm:text-lg">
                  {settings.postponedNote || "Evento rinviato"}
                  {newDate ? (
                    <span className="mt-1 block font-display text-xl tracking-wide normal-case sm:text-2xl">
                      Nuova data: {newDate}
                    </span>
                  ) : null}
                </p>
              ) : null}
              <RegisterButton
                registrationUrl={settings.registrationUrl ?? undefined}
                open={settings.registrationOpen}
                label={settings.registrationLabel}
                closedLabel={settings.registrationClosedLabel}
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Flat colour, no texture, type edge to edge. The hero shouts over a
          photograph; from here the page shouts in paint — one saturated ground
          per section, dotted rules for punctuation, and stickers tilted over the
          type where the badge in the hero was doing it alone. */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="page-x">
          <p className="text-xs font-bold tracking-[0.22em] text-ink/70 uppercase sm:text-sm">
            Dal 2015, ogni primavera
          </p>
        </div>

        <div className="rule-dotted mt-6 text-ink/45 sm:mt-8" />

        {/* The statement, as wide as the page allows */}
        <h2
          data-reveal
          className="page-x relative py-6 font-sans text-[10.5vw] leading-[0.92] font-bold tracking-[-0.035em] text-ink uppercase sm:py-8 lg:text-[7.6vw]"
        >
          {home.introHeading}
        </h2>

        <div className="rule-dotted text-ink/45" />

        <div className="page-x mt-8 sm:mt-10">
          <p className="max-w-xl text-xs leading-relaxed font-bold tracking-[0.06em] text-ink uppercase sm:text-sm">
            {home.introText}
          </p>
          {/* The sticker sits in the air under the paragraph rather than over a
              word: the reference tilts them into gaps, not across letters. */}
          <p className="mt-7 flex">
            <span className="-rotate-3 rounded-full bg-blue px-4 py-1.5 text-[11px] font-bold tracking-[0.16em] text-white uppercase sm:text-xs">
              {home.claim}
            </span>
          </p>
        </div>

        {/* The photographs, big blocks on the flat ground */}
        <div
          data-reveal="stagger"
          className="page-x mt-12 grid grid-cols-2 items-start gap-3 pb-2 sm:mt-16 lg:grid-cols-12 lg:gap-5"
        >
          {introPhotos.map((photo, i) => {
            const shape = [
              "lg:col-span-4 aspect-[4/5]",
              "lg:col-span-3 aspect-[3/4] lg:mt-20",
              "lg:col-span-2 aspect-[2/3] lg:mt-8",
              "lg:col-span-3 aspect-[4/5] lg:mt-28 lg:-rotate-2",
            ][i];
            return (
              <div key={i} className={`relative overflow-hidden ${shape}`}>
                <Image
                  {...photo}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 46vw"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* The one dark block between the hero and the footer. Two of them in a
          row — this and the programme, as it first stood — turned the light
          middle back into the heavy site it was meant to relieve. */}
      <section className="bg-ink py-16 sm:py-20 lg:py-24">
        <div className="page-x">
          <p
            data-reveal
            className="font-sans text-[13vw] leading-[0.9] font-bold tracking-[-0.04em] text-yellow uppercase lg:text-[9vw]"
          >
            {home.claim}
          </p>
          <p className="mt-6 max-w-md text-xs leading-relaxed font-bold tracking-[0.06em] text-white/75 uppercase sm:text-sm">
            {home.claimText}
          </p>
        </div>

        <div className="rule-dotted mt-12 text-white/30 sm:mt-16" />

        <div
          data-reveal="stagger"
          className="page-x mt-10 grid gap-y-10 sm:mt-14 lg:grid-cols-2 lg:gap-x-12"
        >
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="font-sans text-[15vw] leading-[0.85] font-bold tracking-[-0.04em] text-white uppercase lg:text-[6vw]">
                {stat.value}
              </p>
              <p className="mt-3 max-w-xs text-xs font-bold tracking-[0.1em] text-white/55 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {resolveSections(settings.sections)
        .filter((section) => section.visible)
        .map((section) => (
          <Fragment key={section.id}>
            {SECTIONS[section.id]({
              eyebrow: section.eyebrow,
              heading: section.heading,
            })}
          </Fragment>
        ))}

      <section className="bg-white">
        {/* Opens out of a card on the way in and folds back into one on the
            way out, at every width. */}
        <CardEntry className="relative min-h-[100dvh] overflow-hidden bg-ink">
          <Image {...closingPhoto} alt={closingPhoto.alt} fill sizes="100vw" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
          <div className="grain pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" />

          <div className="page-x relative flex min-h-[100dvh] flex-col justify-end pb-10 sm:pb-14">
            <div data-reveal="stagger" className="flex flex-col gap-6">
              <div className="max-w-3xl">
                <h2 className="font-display text-[9vw] leading-[0.9] text-white sm:text-[6vw] lg:text-[4.5vw]">
                  {home.closingHeading}
                </h2>
                <p className="mt-3 max-w-lg text-sm text-white/80 sm:text-base">
                  {home.closingText}
                </p>
              </div>
              <RegisterButton
                registrationUrl={settings.registrationUrl ?? undefined}
                open={settings.registrationOpen}
                label={settings.registrationLabel}
                closedLabel={settings.registrationClosedLabel}
                className="self-start"
              />
            </div>
          </div>
        </CardEntry>
      </section>

      {settings.showSponsors === false ? null : (
        <SponsorSection
          eyebrow={settings.sponsorEyebrow}
          heading={settings.sponsorHeading}
        />
      )}
    </>
  );
}
