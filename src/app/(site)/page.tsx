import Image from "next/image";

import { RegisterButton } from "@/components/register-button";
import { ComeArrivareSection } from "@/components/sections/come-arrivare-section";
import { EdizioniPassateSection } from "@/components/sections/edizioni-passate-section";
import { ProgrammaSection } from "@/components/sections/programma-section";
import { RegolamentoSection } from "@/components/sections/regolamento-section";
import { SponsorSection } from "@/components/sections/sponsor-section";
import { formatDateIt } from "@/lib/format";
import { loadPastEditions, loadSiteSettings } from "@/sanity/fetch";

/**
 * Re-fetch content from Sanity at most once a minute. Without this the page is
 * baked at build time, so publishing in the Studio would not reach the site
 * until the next deploy.
 */
export const revalidate = 60;

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
  const [settings, pastEditions] = await Promise.all([
    loadSiteSettings(),
    loadPastEditions(),
  ]);

  const lastEdition = pastEditions[0];
  const formattedDate = formatDateIt(settings.eventDate);

  return (
    <>
      <section
        id="top"
        className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink"
      >
        <Image
          src="/content/urban-climbing-hero-2.png"
          alt="Climber in azione al Valma Street Block"
          fill
          priority
          className="object-cover object-[center_20%]"
          sizes="100vw"
        />
        {/* Progressive blur (0 → 12px) fading in toward the bottom-left, where the copy sits.
            Stacked layers because CSS has no native progressive backdrop-filter. */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom_left,transparent_25%,black_45%)]" />
          <div className="absolute inset-0 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom_left,transparent_42%,black_62%)]" />
          <div className="absolute inset-0 backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom_left,transparent_58%,black_78%)]" />
          <div className="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom_left,transparent_74%,black_94%)]" />
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
              <p className="font-display text-2xl leading-tight tracking-wide text-white sm:text-3xl">
                {formattedDate ?? "Data da definire"}
                <span className="block">{settings.location}</span>
              </p>
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

      <section className="page-x flex flex-col justify-center bg-white py-14 lg:min-h-[100dvh] lg:py-12">
        {/* DOM order is the stacked order — headline, claim, copy, numbers —
            and the desktop arrangement is done with explicit grid placement
            rather than `order`, so what is read and what is seen stay the same. */}
        <div className="grid gap-x-12 gap-y-9 lg:grid-cols-2 lg:grid-rows-[auto_auto_1fr] lg:gap-x-16 lg:gap-y-6">
          <h2
            data-reveal
            className="max-w-2xl font-display text-4xl leading-[0.95] text-ink sm:text-5xl lg:col-start-1 lg:row-start-1 lg:text-6xl"
          >
            Le vie di Valmadrera diventano una palestra a cielo aperto.
          </h2>

          <div className="lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:pt-24">
            <p
              data-reveal
              className="font-display text-3xl leading-none whitespace-nowrap text-ink sm:text-4xl lg:text-5xl"
            >
              100% in strada
            </p>

            {/* Two by two at every width */}
            <div
              data-reveal="stagger"
              className="mt-5 grid grid-cols-2 gap-3 lg:mt-7 lg:max-w-[440px] lg:gap-4"
            >
              {[
                {
                  src: "/content/urban-climbing-2.png",
                  pos: "object-center",
                },
                {
                  src: "/content/urban-climbing-1.png",
                  pos: "object-[center_25%]",
                },
                {
                  src: "/content/urban-climbing-hand.png",
                  pos: "object-center",
                },
                {
                  src: "/content/urban-climbing-shoe.png",
                  pos: "object-[center_30%]",
                },
              ].map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-square overflow-hidden rounded-2xl lg:rounded-3xl"
                >
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    className={`object-cover ${photo.pos}`}
                    sizes="(min-width: 1024px) 220px, 46vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            data-reveal="stagger"
            className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2"
          >
            <p className="max-w-lg text-base leading-relaxed font-medium text-ink lg:text-lg">
              Nato dall&apos;idea di sette ragazzi di Valmadrera, oggi &egrave;
              uno degli appuntamenti di arrampicata urbana pi&ugrave; sentiti
              del nord Italia.
            </p>
            <p className="max-w-lg text-base leading-relaxed font-medium text-ink lg:text-lg">
              Nessuna parete artificiale: si scala sui muri, sulle pietre e nei
              cortili del paese.
            </p>
          </div>

          <div
            data-reveal="stagger"
            className="grid grid-cols-2 gap-6 lg:col-start-1 lg:row-start-3 lg:grid-cols-1 lg:gap-7 lg:self-end lg:pt-8"
          >
            <div>
              <p className="font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
                +{lastEdition?.participantsCount ?? 470} climbers
              </p>
              <p className="mt-1.5 text-sm text-ink/60">
                In gara all&apos;ultima edizione, competitivi e non.
              </p>
            </div>
            <div>
              <p className="font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
                +50 blocchi
              </p>
              <p className="mt-1.5 text-sm text-ink/60">
                Passaggi brevi ma intensi, sparsi per il paese.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProgrammaSection />
      <ComeArrivareSection />
      <EdizioniPassateSection />
      <RegolamentoSection />

      <section className="relative min-h-[100dvh] overflow-hidden bg-ink">
        <Image
          src="/content/urban-climbing-1.png"
          alt="Climber in azione durante il Valma Street Block"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
        <div className="grain pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" />

        <div className="page-x relative flex min-h-[100dvh] flex-col justify-end pb-10 sm:pb-14">
          <div data-reveal="stagger" className="flex flex-col gap-6">
            <div className="max-w-3xl">
              <h2 className="font-display text-[9vw] leading-[0.9] text-white sm:text-[6vw] lg:text-[4.5vw]">
                Bagai, pronti a scalare il paese?
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/80 sm:text-base">
                50 blocchi tra muri, cornicioni e vicoli. Competitivi o meno, si
                scala tutti insieme.
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
      </section>

      <SponsorSection />
    </>
  );
}
