import { defineField, defineType } from "sanity";

export const programItem = defineType({
  name: "programItem",
  title: "Programma",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "time",
      title: "Orario",
      type: "string",
      description: "Es. 12:30",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "Orario di fine",
      type: "string",
      description: "Opzionale, es. 18:00",
    }),
    defineField({
      name: "description",
      title: "Descrizione",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "location",
      title: "Luogo",
      type: "string",
      description: "Es. Parco via Leopardi",
    }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Gara", value: "gara" },
          { title: "Ritrovo / Iscrizioni", value: "ritrovo" },
          { title: "Premiazioni", value: "premiazioni" },
          { title: "Festa / Musica", value: "festa" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      description:
        "Sfondo della card. Da chiusa la card è molto stretta e alta: usa l'hotspot, altrimenti il ritaglio centrale può mancare il soggetto.",
    }),
    defineField({
      name: "order",
      title: "Ordine",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Ordine cronologico",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "time" },
  },
});
