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
      name: "publicTransportInfo",
      title: "Con i mezzi pubblici",
      type: "text",
      rows: 3,
      description: "Es. incentivo per chi arriva in treno/bus",
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
