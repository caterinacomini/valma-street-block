import { RegulationFaq } from "@/components/regulation-faq";
import { formatDateIt } from "@/lib/format";
import { loadRegulation } from "@/sanity/fetch";

export async function RegolamentoSection() {
  const regulation = await loadRegulation();
  const updatedAt = formatDateIt(regulation.updatedAt);

  return (
    <section id="regolamento" className="page-x scroll-mt-20 py-16 sm:py-24">
      <p data-reveal className="font-mono text-sm tracking-[0.2em] text-blue uppercase">
        Valma Street Block · {new Date().getFullYear() + 1}
      </p>
      <h2 data-reveal className="mt-3 font-display text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
        {regulation.title ?? "Regolamento"}
      </h2>
      {updatedAt ? (
        <p className="mt-3 text-sm text-ink/55">
          Ultimo aggiornamento: {updatedAt}
        </p>
      ) : null}

      <RegulationFaq categories={regulation.faq ?? []} />

      {regulation.pdfUrl ? (
        <div className="mt-10">
          <a
            href={regulation.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/85"
          >
            Scarica il regolamento completo (PDF)
          </a>
        </div>
      ) : null}
    </section>
  );
}
