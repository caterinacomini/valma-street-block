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
}) {
  return defineField({
    name: options.name,
    title: options.title,
    type: "image",
    options: { hotspot: true },
    description: options.description,
    group: options.group,
    fields: [
      defineField({
        name: "alt",
        title: "Testo alternativo",
        type: "string",
        description:
          "Descrive la foto a chi non può vederla, e viene letta dai motori di ricerca. Una riga.",
      }),
    ],
  });
}
