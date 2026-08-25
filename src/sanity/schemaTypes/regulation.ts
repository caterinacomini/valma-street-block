import { defineArrayMember, defineField, defineType } from "sanity";

export const regulation = defineType({
  name: "regulation",
  title: "Regolamento",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      initialValue: "Regolamento",
    }),
    defineField({
      name: "faq",
      title: "Categorie e domande",
      type: "array",
      description:
        "Ogni categoria appare nella colonna di sinistra; le domande a destra.",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqCategory",
          title: "Categoria",
          fields: [
            defineField({
              name: "title",
              title: "Nome categoria",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Domande",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "faqItem",
                  fields: [
                    defineField({
                      name: "question",
                      title: "Domanda",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "answer",
                      title: "Risposta",
                      type: "text",
                      rows: 4,
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: "question" } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare({ title, items }) {
              const count = Array.isArray(items) ? items.length : 0;
              return {
                title,
                subtitle: `${count} domand${count === 1 ? "a" : "e"}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "pdfFile",
      title: "PDF scaricabile",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "updatedAt",
      title: "Ultimo aggiornamento",
      type: "date",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
