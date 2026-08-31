import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { previewClient } from "@/sanity/client";

/**
 * The door the Studio's preview pane comes through. It checks the visitor may
 * actually read drafts before setting the cookie, so the URL alone does not
 * hand anyone an unpublished site.
 */
export const { GET } = defineEnableDraftMode({ client: previewClient });
