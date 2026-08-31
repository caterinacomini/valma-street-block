import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { itITLocale } from "@sanity/locale-it-it";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./src/sanity/runtime-env";
import { schema } from "./src/sanity/schemaTypes";
import { SINGLETONS, structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  name: "valma-street-block",
  title: "Valma Street Block",
  projectId,
  dataset,
  schema,
  document: {
    /* There is one site, one home page, one set of directions, one set of
       rules — so they are not offered in the create menu, and cannot be
       deleted or duplicated into a second copy the site would never read. */
    newDocumentOptions: (prev) =>
      prev.filter((item) => !SINGLETONS.includes(item.templateId)),
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(
            ({ action }) =>
              !["unpublish", "delete", "duplicate"].includes(action ?? ""),
          )
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    // The field labels were already Italian; this translates the Studio around
    // them — buttons, menus, validation, the publish confirmations.
    itITLocale(),
    // A GROQ console is indispensable while building and bewildering to an
    // editor, so it ships only to whoever is running the site locally.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
