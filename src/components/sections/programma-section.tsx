import { ProgramRibbon } from "@/components/program-ribbon";
import { loadProgramItems } from "@/sanity/fetch";

export async function ProgrammaSection() {
  const items = await loadProgramItems();

  return (
    <section
      id="programma"
      className="relative isolate scroll-mt-20 overflow-hidden py-16 sm:py-24"
    >
      <div className="page-x">
        <p
          data-reveal
          className="font-mono text-sm tracking-[0.2em] text-blue uppercase"
        >
          Un giorno, cinquanta blocchi
        </p>
        <h2
          data-reveal
          className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl"
        >
          Il programma della giornata
        </h2>

        {/* isolate so the ribbon can sit at -z-10 behind the cards without
            falling behind the section's own background */}
        <div className="relative isolate mt-10 lg:mt-12">
          <ProgramRibbon />

          <ol className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-stretch lg:gap-4">
            {items.map((item) => (
              <li key={item._id} className="lg:min-w-0 lg:flex-1">
                <article
                  data-reveal
                  className="relative h-full w-full overflow-hidden rounded-3xl px-6 py-6 text-ink backdrop-blur-xl sm:px-8 sm:py-7 lg:px-6 lg:py-6"
                  style={{
                    // Two-layer background: the frosted pane is clipped to the
                    // padding box, the gradient to the border box, which is how
                    // you get an edge that lights up on one diagonal and fades
                    // out on the other. A plain border-color cannot do this.
                    background:
                      "linear-gradient(rgba(254,255,255,0.5), rgba(254,255,255,0.5)) padding-box," +
                      " linear-gradient(135deg, rgba(0,0,0,0.11), rgba(0,0,0,0) 45%," +
                      " rgba(0,0,0,0) 60%, rgba(0,0,0,0.05)) border-box",
                    border: "1px solid transparent",
                  }}
                >
                  <div className="grain pointer-events-none absolute inset-0 opacity-12 mix-blend-multiply" />

                  <p className="font-display text-3xl leading-none sm:text-4xl lg:text-2xl">
                    {item.time}
                    {item.endTime ? (
                      <span className="text-ink/45"> – {item.endTime}</span>
                    ) : null}
                  </p>

                  <h3 className="mt-3 font-display text-2xl tracking-wide sm:text-3xl lg:text-xl">
                    {item.title}
                  </h3>

                  {item.location ? (
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-ink/70">
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
                        className="shrink-0"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {item.location}
                    </p>
                  ) : null}

                  {item.description ? (
                    <p className="mt-3 text-sm text-ink/70 sm:text-base">
                      {item.description}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
