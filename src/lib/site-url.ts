/**
 * Where this site answers from. Metadata, the sitemap and robots all need an
 * absolute address, and it changes the day a real domain is pointed here — so
 * it lives in one place, overridable without a commit.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://valma-street-block.vercel.app";
