import Image from "next/image";

import { urlForImage } from "@/sanity/image";
import { loadSponsors } from "@/sanity/fetch";

// Stand-in wordmarks until the real partner logos land in the CMS.
const PLACEHOLDER_PARTNERS = [
  "Partner Uno",
  "Partner Due",
  "Partner Tre",
  "Partner Quattro",
  "Partner Cinque",
  "Partner Sei",
];

export async function SponsorSection() {
  const sponsors = await loadSponsors();

  const logos = sponsors.length > 0 ? sponsors : null;

  return (
    <section
      id="sponsor"
      className="scroll-mt-20 overflow-hidden bg-white py-16 sm:py-24"
    >
      <div data-reveal="stagger" className="page-x">
        <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
          Grazie a chi ci sostiene
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
          I nostri partner
        </h2>
      </div>

      {/* Marquee — the list is duplicated so the loop is seamless */}
      <div
        data-reveal
        className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        <div className="marquee-track flex w-max items-center gap-16 sm:gap-24">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center gap-16 sm:gap-24"
            >
              {logos
                ? logos.map((sponsor) => {
                    const logoUrl = sponsor.logo
                      ? urlForImage(sponsor.logo).width(320).url()
                      : null;
                    return logoUrl ? (
                      <Image
                        key={`${copy}-${sponsor._id}`}
                        src={logoUrl}
                        alt={sponsor.name}
                        width={160}
                        height={56}
                        className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                      />
                    ) : (
                      <span
                        key={`${copy}-${sponsor._id}`}
                        className="font-display text-2xl whitespace-nowrap text-ink/45 sm:text-3xl"
                      >
                        {sponsor.name}
                      </span>
                    );
                  })
                : PLACEHOLDER_PARTNERS.map((name) => (
                    <span
                      key={`${copy}-${name}`}
                      className="font-display text-2xl whitespace-nowrap text-ink/35 sm:text-3xl"
                    >
                      {name}
                    </span>
                  ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
