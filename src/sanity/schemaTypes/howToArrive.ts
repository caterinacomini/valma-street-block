import { defineField, defineType } from "sanity";

export const howToArrive = defineType({
  name: "howToArrive",
  title: "Come arrivare",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      title: "Testo introduttivo",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "address",
      title: "Indirizzo punto di ritrovo",
      type: "string",
    }),
    defineField({
      name: "carInfo",
      title: "In auto",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "transitInfo",
      title: "Con i mezzi",
      type: "text",
      rows: 3,
      description:
        "Treno e bus, come per l'auto. Valmadrera ha una stazione sua sulla " +
        "linea Como-Lecco (Trenord: S7 da Milano, R18 da Como).",
    }),
    defineField({
      name: "publicTransportInfo",
      title: "Nota biglietti",
      type: "text",
      rows: 3,
      description:
        "L'incentivo per chi arriva in treno o bus. Compare come pillola " +
        "gialla in fondo, non come indicazione stradale.",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Link Google Maps",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "address" },
    prepare({ title }) {
      return { title: title || "Come arrivare" };
    },
  },
});
