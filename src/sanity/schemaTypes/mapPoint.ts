import { defineField, defineType } from "sanity";

export const mapPoint = defineType({
  name: "mapPoint",
  title: "Punto sulla mappa",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Etichetta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Parcheggio", value: "parcheggio" },
          { title: "Ritrovo / Pettorali", value: "ritrovo" },
          { title: "Zona gara", value: "blocco" },
          { title: "Punto informazioni", value: "info" },
          { title: "Ristoro", value: "ristoro" },
          { title: "Stazione / Bus", value: "trasporti" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descrizione",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "x",
      title: "Posizione X (%)",
      type: "number",
      description: "Posizione orizzontale sulla mappa disegnata, da 0 a 100",
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "y",
      title: "Posizione Y (%)",
      type: "number",
      description: "Posizione verticale sulla mappa disegnata, da 0 a 100",
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "order",
      title: "Ordine",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "type" },
  },
});

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
