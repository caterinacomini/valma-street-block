import { defineArrayMember, defineField, defineType } from "sanity";

import { MOVABLE_SECTIONS } from "../../lib/sections";
import { imageWithAlt } from "./imageWithAlt";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Impostazioni sito",
  type: "document",
  fieldsets: [
    {
      name: "condivisione",
      title: "Condivisione",
      options: { collapsible: true, collapsed: false },
      description:
        "Cosa si vede quando il link del sito finisce su Google, in una chat o su Instagram. Non compare sulla pagina.",
    },
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
      title: "Descrizione",
      type: "text",
      rows: 3,
      fieldset: "condivisione",
      description:
        "Non compare sulla pagina: è la riga che Google mostra sotto il titolo, e quella che si legge quando qualcuno incolla il link in una chat. Due righe asciutte che dicono cos'è l'evento.",
      validation: (rule) => rule.max(160).warning(
        "Oltre i 160 caratteri Google taglia la frase a metà.",
      ),
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
    imageWithAlt({
      name: "shareImage",
      title: "Immagine",
      fieldset: "condivisione",
      description:
        "Il rettangolo che accompagna il link. Va bene 1200×630 pixel: più stretta o più alta viene ritagliata. Se la lasci vuota resta quella preparata a mano, azzurra col marchio.",
    }),
    defineField({
      name: "sections",
      title: "Sezioni della pagina",
      type: "array",
      description:
        "Trascina per cambiare l'ordine sul sito, e spegni l'interruttore per nascondere una sezione. Una sezione nascosta sparisce anche dal menu. Se lasci vuoto vale l'ordine predefinito.",
      of: [
        defineArrayMember({
          type: "object",
          name: "sectionChoice",
          fields: [
            defineField({
              name: "section",
              title: "Sezione",
              type: "string",
              options: {
                list: MOVABLE_SECTIONS.map((s) => ({ title: s.label, value: s.id })),
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "visible",
              title: "Mostra sul sito",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { section: "section", visible: "visible" },
            prepare: ({ section, visible }) => ({
              title:
                MOVABLE_SECTIONS.find((s) => s.id === section)?.label ?? section,
              subtitle: visible === false ? "nascosta" : "visibile",
            }),
          },
        }),
      ],
      validation: (rule) =>
        rule.max(MOVABLE_SECTIONS.length).custom((value) => {
          const ids = (value ?? []).map((v) => (v as { section?: string })?.section);
          const dupes = ids.filter((id, i) => id && ids.indexOf(id) !== i);
          return dupes.length ? "Una sezione compare più di una volta." : true;
        }),
    }),
    defineField({
      name: "showSponsors",
      title: "Mostra gli sponsor",
      type: "boolean",
      initialValue: true,
      description:
        "Gli sponsor chiudono la pagina dopo l'invito finale, quindi non si spostano — ma si possono nascondere.",
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
