import { EdizioniCarousel, type EditionCard } from "@/components/edizioni-carousel";
import { urlForImage } from "@/sanity/image";
import { loadPastEditions } from "@/sanity/fetch";

const FALLBACK_COVERS = [
  "/content/urban-climbing-hero.jpg",
  "/content/urban-climbing-2.jpg",
  "/content/urban-climbing-shoe.jpg",
  "/content/urban-climbing-hand.jpg",
  "/content/urban-climbing-beam.jpg",
  "/content/urban-climbing-wall-kid.jpg",
];

export async function EdizioniPassateSection({
  eyebrow,
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const editions = await loadPastEditions();

  const cards: EditionCard[] = editions.map((edition, i) => {
    const gallery = (edition.gallery ?? []).map((image) =>
      urlForImage(image).width(400).height(300).url(),
    );
    const cover = edition.coverImage
      ? urlForImage(edition.coverImage).width(400).height(300).url()
      : FALLBACK_COVERS[i % FALLBACK_COVERS.length];

    // Without a real gallery yet, cycle through the other stock shots so the
    // hover flipbook still has something to play.
    const frames =
      gallery.length > 0
        ? [cover, ...gallery]
        : [
            cover,
            FALLBACK_COVERS[(i + 1) % FALLBACK_COVERS.length],
            FALLBACK_COVERS[(i + 2) % FALLBACK_COVERS.length],
          ];

    return {
      id: edition._id,
      year: edition.year,
      editionNumber: edition.editionNumber,
      participantsCount: edition.participantsCount,
      highlights: edition.highlights,
      coverUrl: cover,
      frames,
    };
  });

  /* No white of its own: it takes the page's, which is the same colour until
     Come arrivare tints it — and then this section has to come along, or the
     blue stops dead at its top edge. */
  return (
    <section id="edizioni-passate" className="scroll-mt-20">
      <EdizioniCarousel editions={cards} eyebrow={eyebrow} heading={heading} />
    </section>
  );
}
