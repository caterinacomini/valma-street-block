// Single source of Sanity env values, deliberately non-throwing.
//
// These are read at module scope by both the site and the embedded Studio, and
// `next build` evaluates those modules while collecting page data — so throwing
// on a missing variable fails the build instead of just disabling the CMS.
// Instead we fall back: the site renders its fallback content (see fetch.ts)
// and the Studio simply cannot connect until real credentials are set.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

/** True once a real project is wired up, for surfacing setup state in the UI. */
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
