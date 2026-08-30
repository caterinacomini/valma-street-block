import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The two stretches of the landing page that are prose rather than data: the
 * section under the hero, and the card that closes the page. Everything else
 * on the home page is assembled from the documents it belongs to.
 */
export const homeContent = defineType({
  name: "homeContent",
  title: "Home",
  type: "document",
  groups: [
    { name: "intro", title: "Sezione introduttiva", default: true },
    { name: "closing", title: "Card finale" },
  ],
  fields: [
    defineField({
      name: "introHeading",
      title: "Titolo",
      type: "text",
      rows: 2,
      group: "intro",
      description: "Il titolo grande sotto la copertina.",
    }),
    defineField({
      name: "introText",
      title: "Paragrafo",
      type: "text",
      rows: 3,
      group: "intro",
    }),
    defineField({
      name: "claim",
      title: "Claim",
      type: "string",
      group: "intro",
      description:
        "Sta su una riga sola e non va a capo: tienilo corto, tipo «100% in strada».",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "claimText",
      title: "Paragrafo del claim",
      type: "text",
      rows: 3,
      group: "intro",
    }),
    defineField({
      name: "introPhotos",
      title: "Foto della griglia",
      type: "array",
      group: "intro",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      description:
        "Quattro foto, in griglia due per due. Vengono ritagliate quadrate: usa l'hotspot per scegliere il punto da tenere sempre in campo.",
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "stats",
      title: "Numeri",
      type: "array",
      group: "intro",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "value",
              title: "Numero",
              type: "string",
              description: "Scritto come va mostrato, per esempio «+470 climbers».",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Didascalia",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.max(2),
      description: "Due, non di più: il layout ne tiene due.",
    }),
    defineField({
      name: "closingHeading",
      title: "Titolo",
      type: "string",
      group: "closing",
    }),
    defineField({
      name: "closingText",
      title: "Paragrafo",
      type: "text",
      rows: 3,
      group: "closing",
    }),
    defineField({
      name: "closingImage",
      title: "Foto di sfondo",
      type: "image",
      options: { hotspot: true },
      group: "closing",
      description:
        "A tutto schermo, con il testo in basso. L'hotspot decide cosa resta in campo sui telefoni, dove il taglio è molto più stretto.",
    }),
  ],
  preview: { prepare: () => ({ title: "Home" }) },
});
