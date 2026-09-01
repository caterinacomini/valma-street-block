import { createDataAttribute } from "next-sanity";

import { dataset, projectId } from "./runtime-env";

/**
 * Marks an element as belonging to a field, for the values stega cannot reach.
 *
 * Stega hides a string's origin inside the string, which works only while the
 * string survives untouched. A date read as "2027-04-10" and rendered as
 * "10 aprile 2027" is a different string; a number was never a string at all.
 * Those need saying out loud, and this says it.
 *
 * Emitted only in preview: outside it the attribute would be inert weight in
 * everyone's HTML.
 */
const attribute = createDataAttribute({
  projectId,
  dataset,
  baseUrl: "/studio",
});

export function fieldAttr(
  preview: boolean,
  id: string,
  type: string,
  path: string,
): string | undefined {
  return preview ? attribute.combine({ id, type, path }).toString() : undefined;
}
