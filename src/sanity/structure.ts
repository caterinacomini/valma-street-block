import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenuti")
    .items([
      S.listItem()
        .title("Impostazioni sito")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Home")
        .child(S.document().schemaType("homeContent").documentId("homeContent")),
      S.listItem()
        .title("Come arrivare")
        .child(
          S.document().schemaType("howToArrive").documentId("howToArrive"),
        ),
      S.listItem()
        .title("Regolamento")
        .child(
          S.document().schemaType("regulation").documentId("regulation"),
        ),
      S.divider(),
      S.documentTypeListItem("programItem").title("Programma"),
      S.documentTypeListItem("sponsor").title("Sponsor"),
      S.documentTypeListItem("pastEdition").title("Edizioni passate"),
    ]);
