import type { Metadata } from "next";
import { metadata as studioMetadata } from "next-sanity/studio";

import { StudioClient } from "./studio-client";

export const dynamic = "force-static";

export { viewport } from "next-sanity/studio";

/**
 * The Studio's own metadata, plus a refusal to be indexed: it is publicly
 * reachable, and a login screen ranking under the festival's name helps nobody.
 */
export const metadata: Metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioClient />;
}
