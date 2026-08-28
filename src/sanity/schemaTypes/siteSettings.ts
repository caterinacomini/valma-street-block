import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Impostazioni sito",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nome evento",
      type: "string",
      initialValue: "Valma Street Block",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editionNumber",
      title: "Numero edizione",
      type: "number",
      description: "Es. 11 per l'11ª edizione",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Frase breve mostrata nell'hero",
    }),
    defineField({
      name: "heroImage",
      title: "Immagine hero",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "eventDate",
      title: "Data evento",
      type: "date",
    }),
    defineField({
      name: "rainDate",
      title: "Data di recupero (maltempo)",
      type: "date",
    }),
    defineField({
      name: "location",
      title: "Località",
      type: "string",
      initialValue: "Valmadrera (LC)",
    }),
    defineField({
      name: "intro",
      title: "Testo introduttivo",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "registrationUrl",
      title: "Link iscrizione",
      type: "url",
      description: "Link esterno (es. Kronoman) usato dal pulsante Iscriviti ora",
    }),
    defineField({
      name: "registrationOpen",
      title: "Iscrizioni aperte",
      type: "boolean",
      initialValue: false,
      description:
        "Spegnilo e il pulsante smette di essere un link: resta visibile ma non porta da nessuna parte. Accendilo il giorno dell'apertura.",
    }),
    defineField({
      name: "registrationLabel",
      title: "Testo del pulsante, iscrizioni aperte",
      type: "string",
      description: "Se vuoto: Iscriviti ora",
    }),
    defineField({
      name: "registrationClosedLabel",
      title: "Testo del pulsante, iscrizioni chiuse",
      type: "string",
      description: "Poche parole. Se vuoto: Stay tuned",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "contactEmail",
      title: "Email di contatto",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline" },
  },
});
