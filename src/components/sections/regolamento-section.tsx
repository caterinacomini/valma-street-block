import { RegulationFaq } from "@/components/regulation-faq";
import { formatDateIt } from "@/lib/format";
import { loadRegulation } from "@/sanity/fetch";
import { Download } from "lucide-react";

export async function RegolamentoSection({
  eyebrow,
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const regulation = await loadRegulation();
  const updatedAt = formatDateIt(regulation.updatedAt);

  return (
    <section id="regolamento" className="page-x scroll-mt-20 py-16 sm:py-24">
      {/* Heading on the left, the download beside it — where someone looking
          for the rules in full is already looking. */}
      <div
        data-reveal="stagger"
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
            {eyebrow || `Valma Street Block · ${new Date().getFullYear() + 1}`}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
            {heading || regulation.title || "Regolamento"}
          </h2>
          {updatedAt ? (
            <p className="mt-3 text-sm text-ink/55">
              Ultimo aggiornamento: {updatedAt}
            </p>
          ) : null}
        </div>

        {regulation.pdfUrl ? (
          <a
            href={regulation.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 border-ink px-6 py-3 text-sm font-semibold tracking-wide text-ink uppercase transition hover:bg-ink hover:text-white sm:self-auto"
          >
            {regulation.pdfLabel || "Scarica il regolamento"}
            <Download size={14} aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <RegulationFaq categories={regulation.faq ?? []} />


    </section>
  );
}
