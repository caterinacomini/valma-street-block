import { defineField, defineType } from "sanity";

export const pastEdition = defineType({
  name: "pastEdition",
  title: "Edizione passata",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Anno",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editionNumber",
      title: "Numero edizione",
      type: "number",
    }),
    defineField({
      name: "coverImage",
      title: "Immagine di copertina",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Galleria foto",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "highlights",
      title: "Racconto / numeri",
      type: "text",
      rows: 4,
      description: "Es. numero di partecipanti, aneddoti, momenti salienti",
    }),
    defineField({
      name: "participantsCount",
      title: "Numero partecipanti",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Anno (decrescente)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "year", subtitle: "highlights", media: "coverImage" },
    prepare({ title, subtitle, media }) {
      return {
        title: `Edizione ${title}`,
        subtitle,
        media,
      };
    },
  },
});
