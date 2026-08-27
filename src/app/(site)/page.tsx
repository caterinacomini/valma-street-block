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
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-x flex flex-col justify-center bg-white py-14 lg:min-h-[100dvh] lg:py-16">
        <h2 className="ml-auto max-w-2xl text-right font-display text-2xl leading-tight text-ink sm:text-3xl lg:text-4xl">
          Dal 2015 le vie di Valmadrera diventano una palestra a cielo aperto.
        </h2>

        <div className="mt-10 grid items-end gap-x-12 gap-y-9 lg:mt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-x-16">
          {/* Left: the claim, then where the thing came from */}
          <div className="flex flex-col gap-4">
            <p className="font-display text-4xl leading-none whitespace-nowrap text-ink sm:text-5xl lg:text-6xl">
              100% in strada
            </p>
            <p className="max-w-lg text-base leading-relaxed font-medium text-ink lg:text-lg">
              Nessuna parete artificiale: si scala sui muri, sulle pietre e nei
              cortili del paese.
            </p>
            <p className="max-w-lg text-base leading-relaxed font-medium text-ink lg:text-lg">
              Nato dall&apos;idea di sette ragazzi di Valmadrera, oggi &egrave;
              uno degli appuntamenti di arrampicata urbana pi&ugrave; sentiti
              del nord Italia.
            </p>
          </div>

          {/* Right: the two numbers as photo cards, on the hero's blur + grain recipe.
            Sized in container units so both titles land at the same size whatever
            the column does. Not interactive: the pill is a caption, not a button. */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              {
                src: "/content/urban-climbing-2.png",
                pos: "object-[center_35%]",
                value: `+${lastEdition?.participantsCount ?? 470}`,
                label: "climbers",
                caption: "Competitivi e non",
              },
              {
                src: "/content/urban-climbing-beam.png",
                pos: "object-[center_45%]",
                value: "+50",
                label: "blocchi",
                caption: "Sparsi per il paese",
              },
            ].map((card) => (
              <div
                key={card.src}
                className="@container relative aspect-square overflow-hidden rounded-3xl bg-ink"
              >
                <Image
                  src={card.src}
                  alt=""
                  fill
                  className={`object-cover ${card.pos}`}
                  sizes="(min-width: 1024px) 330px, (min-width: 640px) 45vw, 90vw"
                />
                {/* Progressive blur rising from the bottom, where the type sits */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black_14%,transparent_52%)]" />
                  <div className="absolute inset-0 backdrop-blur-[5px] [mask-image:linear-gradient(to_top,black_4%,transparent_34%)]" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
                <div className="grain pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-[2.5cqw] p-[5.5cqw]">
                  <p className="font-display text-[13cqw] leading-[0.88] text-white">
                    <span className="block">{card.value}</span>
                    <span className="block">{card.label}</span>
                  </p>
                  <p className="max-w-[94%] text-[5.2cqw] leading-snug font-medium tracking-wide text-white/85">
                    {card.caption}
                  </p>
                </div>
              </div>
            ))}
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
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
              size="lg"
              className="shrink-0"
            />
          </div>
        </div>
      </section>

      <SponsorSection />
    </>
  );
}
