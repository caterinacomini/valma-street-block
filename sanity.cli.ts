import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./src/sanity/runtime-env";

/**
 * Config for the Sanity CLI (`npm run studio:*`).
 *
 * The Studio is hosted by Sanity rather than embedded in the Next app: Sanity 6
 * and Next 16 cannot share a bundle (uncompiled JSX in @sanity/sdk-react, and
 * swr's react-server build). Schemas still live in src/sanity/schemaTypes and
 * are published from here.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  // Becomes https://<studioHost>.sanity.studio once deployed.
  studioHost: "valma-street-block",
});
