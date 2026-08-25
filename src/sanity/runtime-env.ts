// Defensive env access for code that must keep rendering (with fallback
// content, see src/sanity/fetch.ts) even before a real Sanity project is
// connected. For the Studio's own config, see ./env.ts, which fails fast
// instead since the Studio is unusable without real credentials.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
