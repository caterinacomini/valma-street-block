import { ArrivalMap } from "@/components/arrival-map";
import { ArrivalMapMobile } from "@/components/arrival-map-mobile";
import { loadHowToArrive } from "@/sanity/fetch";

export async function ComeArrivareSection({
  eyebrow,
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const info = await loadHowToArrive();

  return (
    <section id="come-arrivare" className="page-x scroll-mt-20 py-16 sm:py-24">
      {/* Heading + intro */}
      <div
        data-reveal="stagger"
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
            {heading}
          </h2>
        </div>

        {info.intro ? (
          <p className="max-w-md text-base leading-relaxed font-medium text-ink lg:text-lg">
            {info.intro}
          </p>
        ) : null}
      </div>

      {/* Full-width animated routes */}
      {/* Same journey, two shapes: wide and side-to-side once there is room,
          vertical and scroll-driven when there is not. */}
      <div className="mt-12 lg:mt-16">
        <div className="lg:hidden">
          <ArrivalMapMobile />
        </div>
        <div className="hidden lg:block">
          <ArrivalMap />
        </div>
      </div>

      {/* Practical details */}
      <div
        data-reveal="stagger"
        className="mt-12 grid gap-8 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {info.address ? (
          <div>
            <h3 className="font-display text-lg tracking-wide text-ink">
              Punto di ritrovo
            </h3>
            <p className="mt-2 text-base text-ink/75">{info.address}</p>
            {info.mapEmbedUrl ? (
              <a
                href={info.mapEmbedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
              >
                Apri in Google Maps
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </a>
            ) : null}
          </div>
        ) : null}

        {info.carInfo ? (
          <div>
            <h3 className="font-display text-lg tracking-wide text-ink">
              In auto
            </h3>
            <p className="mt-2 text-base text-ink/75">{info.carInfo}</p>
            <a
              href="https://www.google.com/maps/search/parcheggi+Valmadrera"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
            >
              Scopri i parcheggi
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        ) : null}

        {info.publicTransportInfo ? (
          <div>
            <h3 className="font-display text-lg tracking-wide text-ink">
              Vieni con i mezzi pubblici?
            </h3>
            <p className="mt-2 text-base text-ink/75">
              {info.publicTransportInfo}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
