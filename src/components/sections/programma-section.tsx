import { loadProgramItems } from "@/sanity/fetch";

const CATEGORY_LABEL: Record<string, string> = {
  gara: "Gara",
  ritrovo: "Ritrovo",
  premiazioni: "Premiazioni",
  festa: "Festa",
};

export async function ProgrammaSection() {
  const items = await loadProgramItems();

  return (
    <section id="programma" className="page-x scroll-mt-20 py-16 sm:py-24">
      <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
        Un giorno, cinquanta blocchi
      </p>
      <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
        Il programma della giornata
      </h2>

      <ol className="mt-12">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item._id} className="relative">
              <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-8">
                {/* Time + meta */}
                <div className="sm:w-52 sm:shrink-0">
                  <p className="font-display text-3xl leading-none text-blue sm:text-4xl">
                    {item.time}
                  </p>
                  {item.endTime ? (
                    <p className="mt-1.5 text-sm text-ink/55">
                      fino alle {item.endTime}
                    </p>
                  ) : null}
                  {item.category ? (
                    <p className="mt-2 text-xs font-semibold tracking-widest text-ink/45 uppercase">
                      {CATEGORY_LABEL[item.category] ?? item.category}
                    </p>
                  ) : null}
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-2xl bg-ink/5 px-6 py-5">
                  <h3 className="font-display text-xl tracking-wide text-ink sm:text-2xl">
                    {item.title}
                  </h3>
                  {item.location ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink/70">
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {item.location}
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-2 text-sm text-ink/70 sm:text-base">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>

              {!isLast ? <div aria-hidden="true" className="h-2" /> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
