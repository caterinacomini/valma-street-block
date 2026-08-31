import type { StructureResolver } from "sanity/structure";

/** The documents there is exactly one of, kept out of the create menu. */
export const SINGLETONS = [
  "siteSettings",
  "homeContent",
  "howToArrive",
  "regulation",
];

/**
 * Ordered by the rhythm of the year rather than alphabetically: what gets
 * touched first when an edition is announced comes first, and the divider
 * separates the coming edition from the archive that outlives it.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenuti")
    .items([
      S.listItem()
        .title("Impostazioni sito")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Impostazioni sito"),
        ),
      S.listItem()
        .title("Home")
        .child(
          S.document()
            .schemaType("homeContent")
            .documentId("homeContent")
            .title("Home"),
        ),
      S.documentTypeListItem("programItem").title("Programma"),
      S.listItem()
        .title("Come arrivare")
        .child(
          S.document()
            .schemaType("howToArrive")
            .documentId("howToArrive")
            .title("Come arrivare"),
        ),
      S.listItem()
        .title("Regolamento")
        .child(
          S.document()
            .schemaType("regulation")
            .documentId("regulation")
            .title("Regolamento"),
        ),
      S.divider(),
      S.documentTypeListItem("sponsor").title("Sponsor"),
      S.documentTypeListItem("pastEdition").title("Edizioni passate"),
    ]);
