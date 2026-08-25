import { loadHowToArrive } from "@/sanity/fetch";

export async function ComeArrivareSection() {
  const info = await loadHowToArrive();

  return (
    <section id="come-arrivare" className="page-x scroll-mt-20 py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Map placeholder */}
        <div className="order-2 lg:order-1">
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-ink/25 bg-ink/[0.03] text-center">
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink/35"
              aria-hidden="true"
            >
              <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
              <path d="M9 4v14M15 6v14" />
            </svg>
            <p className="font-display text-lg tracking-wide text-ink/45">
              Mappa in arrivo
            </p>
            <p className="max-w-xs text-sm text-ink/40">
              Qui troverai la mappa disegnata a mano con blocchi, parcheggi e
              punto di ritrovo.
            </p>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
            Valmadrera · Lecco
          </p>
          <h2 className="mt-4 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
            Come arrivare
          </h2>

          {info.intro ? (
            <p className="mt-6 max-w-lg text-lg leading-relaxed font-medium text-ink sm:text-xl">
              {info.intro}
            </p>
          ) : null}

          <dl className="mt-8 flex flex-col gap-6">
            {info.address ? (
              <div>
                <dt className="font-display text-lg tracking-wide text-ink">
                  Punto di ritrovo
                </dt>
                <dd className="mt-1 text-base text-ink/75">{info.address}</dd>
              </div>
            ) : null}

            {info.carInfo ? (
              <div>
                <dt className="font-display text-lg tracking-wide text-ink">
                  In auto
                </dt>
                <dd className="mt-1 max-w-lg text-base text-ink/75">
                  {info.carInfo}
                </dd>
              </div>
            ) : null}

            {info.publicTransportInfo ? (
              <div className="border-l-2 border-yellow pl-5">
                <dt className="font-display text-lg tracking-wide text-ink">
                  Con i mezzi pubblici
                </dt>
                <dd className="mt-1 max-w-lg text-base text-ink/75">
                  {info.publicTransportInfo}
                </dd>
              </div>
            ) : null}
          </dl>

          {info.mapEmbedUrl ? (
            <a
              href={info.mapEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
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
      </div>
    </section>
  );
}
