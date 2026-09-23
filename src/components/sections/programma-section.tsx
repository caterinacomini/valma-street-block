import { ProgramAccordion } from "@/components/program-accordion";
import { loadProgramItems } from "@/sanity/fetch";

export async function ProgrammaSection({
  eyebrow,
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
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
          {eyebrow}
        </p>
        <h2
          data-reveal
 className="mt-3 font-display heading-1 leading-none text-ink "
        >
          {heading}
        </h2>

        {/* isolate so the ribbon can sit at -z-10 behind the cards without
            falling behind the section's own background */}
        <div className="mt-10 lg:mt-12">
          <ProgramAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
