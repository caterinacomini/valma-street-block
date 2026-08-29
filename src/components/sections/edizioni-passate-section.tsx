import { EdizioniCarousel, type EditionCard } from "@/components/edizioni-carousel";
import { urlForImage } from "@/sanity/image";
import { loadPastEditions } from "@/sanity/fetch";

const FALLBACK_COVERS = [
  "/content/urban-climbing-hero.png",
  "/content/urban-climbing-2.png",
  "/content/urban-climbing-shoe.png",
  "/content/urban-climbing-hand.png",
  "/content/urban-climbing-beam.png",
  "/content/urban-climbing-wall-kid.jpg",
];

export async function EdizioniPassateSection() {
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
      coverUrl: cover,
      frames,
    };
  });

  return (
    <section id="edizioni-passate" className="scroll-mt-20 bg-white">
      <EdizioniCarousel editions={cards} />
    </section>
  );
}
