import { defineField } from "sanity";

/**
 * Every photograph here is cropped by the layout rather than placed, so each
 * one carries two things the editor owns: the hotspot that decides what
 * survives a narrow crop, and its own alt text — a swapped photograph must not
 * inherit the description of the one it replaced.
 */
export function imageWithAlt(options: {
  name: string;
  title: string;
  description?: string;
  group?: string;
  /**
   * Adds a horizontal nudge per breakpoint. Only worth it where the crop
   * changes shape drastically — a full-bleed hero keeps under a third of its
   * width on a phone and nearly all of it on a desktop, which is two different
   * photographs, and one hotspot cannot be both.
   */
  perBreakpointFocus?: boolean;
}) {
  const focus = (name: string, title: string, hint: string) =>
    defineField({
      name,
      title,
      type: "number",
      description: `${hint} Da 0 (tutto a sinistra) a 100 (tutto a destra). Lascia vuoto per usare il punto scelto sull'immagine.`,
      validation: (rule) => rule.min(0).max(100),
      fieldset: "focus",
    });
  return defineField({
    name: options.name,
    title: options.title,
    type: "image",
    options: { hotspot: true },
    description: options.description,
    group: options.group,
    fieldsets: options.perBreakpointFocus
      ? [
          {
            name: "focus",
            title: "Inquadratura per schermo",
            options: { collapsible: true, collapsed: true },
            description:
              "Serve solo se il punto scelto sopra non regge a tutte le larghezze.",
          },
        ]
      : undefined,
    fields: [
      defineField({
        name: "alt",
        title: "Testo alternativo",
        type: "string",
        description:
          "Descrive la foto a chi non può vederla, e viene letta dai motori di ricerca. Una riga.",
      }),
      ...(options.perBreakpointFocus
        ? [
            focus("focusPhone", "Telefono", "Il taglio più stretto: tiene circa un terzo della larghezza."),
            focus("focusTablet", "Tablet", "Circa metà della larghezza."),
            focus("focusDesktop", "Computer", "Quasi tutta la larghezza."),
          ]
        : []),
    ],
  });
}
