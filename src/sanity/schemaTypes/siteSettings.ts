import { defineField, defineType } from "sanity";

import { imageWithAlt } from "./imageWithAlt";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Impostazioni sito",
  type: "document",
  fieldsets: [
    {
      name: "rinvio",
      title: "Rinvio per maltempo",
      options: { collapsible: true, collapsed: true },
      description:
        "Serve solo se l'edizione salta. Finché l'interruttore è spento, sul sito non compare nulla.",
    },
  ],
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
    imageWithAlt({
      name: "heroImage",
      title: "Immagine di copertina",
      perBreakpointFocus: true,
      description:
        "Occupa tutto lo schermo. Sui telefoni il taglio è molto più stretto che su computer: usa l'hotspot per marcare cosa deve restare sempre in campo.",
    }),
    defineField({
      name: "eventDate",
      title: "Data evento",
      type: "date",
    }),
    defineField({
      name: "postponed",
      title: "Evento rinviato",
      type: "boolean",
      initialValue: false,
      fieldset: "rinvio",
      description:
        "Accendilo solo quando l'edizione è stata effettivamente rinviata. Il sito lo annuncia in copertina e mostra la nuova data al posto di quella prevista.",
    }),
    defineField({
      name: "rainDate",
      title: "Nuova data",
      type: "date",
      fieldset: "rinvio",
      description: "Compilala insieme all'interruttore qui sopra.",
    }),
    defineField({
      name: "postponedNote",
      title: "Cosa scrivere",
      type: "string",
      fieldset: "rinvio",
      description:
        "Il testo dell'etichetta azzurra in copertina — per esempio «Annullata per allerta meteo». Se lo lasci vuoto scrive «Evento rinviato».",
      validation: (rule) => rule.max(60),
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
    defineField({
      name: "photoCredit",
      title: "Credito fotografico",
      type: "string",
      description:
        "Riga mostrata nel footer, sotto gli organizzatori. Lasciala vuota per non mostrarla.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location" },
  },
});
