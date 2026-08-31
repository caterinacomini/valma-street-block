import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./runtime-env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: false,
});

/**
 * The client used only while Draft Mode is on, which is to say only inside the
 * Studio's preview pane.
 *
 * Three things differ and all three matter: no CDN, because an editor typing a
 * word should not wait a minute for a cache; the drafts perspective, so what
 * they see is what they have written rather than what they last published; and
 * stega, which hides the origin of every string inside the string itself so the
 * page can offer "edit this" on the thing you click.
 *
 * Stega must never reach a visitor — the invisible characters travel with the
 * text into copy-and-paste — which is why it lives here and not on `client`.
 *
 * A Viewer token is enough. The seed script's Editor token works too, and is
 * accepted as a fallback so preview runs locally without a second token.
 */
export const previewClient = client.withConfig({
  useCdn: false,
  perspective: "drafts",
  token:
    process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  stega: { enabled: true, studioUrl: "/studio" },
});
