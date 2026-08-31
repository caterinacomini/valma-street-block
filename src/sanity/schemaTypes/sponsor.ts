import { defineField, defineType } from "sanity";

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Sito web",
      type: "url",
    }),
    defineField({
      name: "tier",
      title: "Livello",
      type: "string",
      options: {
        list: [
          { title: "Main sponsor", value: "main" },
          { title: "Gold", value: "gold" },
          { title: "Silver", value: "silver" },
          { title: "Partner tecnico", value: "partner" },
        ],
        layout: "radio",
      },
      initialValue: "partner",
    }),
    defineField({
      name: "order",
      title: "Ordine",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Livello",
      name: "tierOrder",
      by: [
        { field: "tier", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", tier: "tier", media: "logo" },
    /* "partner" is what the field stores; nobody says it out loud. */
    prepare({ title, tier, media }) {
      const labels: Record<string, string> = {
        main: "Main sponsor",
        gold: "Gold",
        silver: "Silver",
        partner: "Partner tecnico",
      };
      return { title, subtitle: tier ? labels[tier] : undefined, media };
    },
  },
});
