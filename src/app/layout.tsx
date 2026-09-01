import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site-url";
import { urlForImage } from "@/sanity/image";
import { loadSiteSettings } from "@/sanity/fetch";
import "./globals.css";

/**
 * Koulen with the accents it never had. The upstream face carries no à è é ì ò ù
 * — nor ª, nor a typographic apostrophe — and this site is in Italian with most
 * display text coming from the Studio, so the missing letters were being drawn
 * by whatever the browser reached for, mid-word and at another width.
 * Rebuild with scripts/build-koulen-vsb.py.
 */
const koulen = localFont({
  src: "./fonts/KoulenVSB.woff2",
  variable: "--font-koulen",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const FALLBACK_DESCRIPTION =
  "Valma Street Block: la gara di arrampicata urbana tra le vie di Valmadrera.";

/**
 * Read from the Studio like everything else, so the line that shows up in
 * search results and in a pasted link is the organisation's to write. The
 * description falls back to the introduction, then to the sentence above.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await loadSiteSettings();
  const title = settings.title?.trim() || "Valma Street Block";
  const description = settings.intro?.trim() || FALLBACK_DESCRIPTION;
  const where = [settings.location].filter(Boolean).join(" ");
  /* An uploaded picture is cropped to the 1200×630 every platform expects,
     around the editor's hotspot; otherwise the card built by
     scripts/build-og-image.py stands. */
  const share = settings.shareImage?.asset
    ? urlForImage(settings.shareImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .crop("focalpoint")
        .url()
    : "/og.jpg";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${title}` },
    description,
    applicationName: title,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: title,
      title,
      description,
      url: "/",
      images: [
        {
          url: share,
          width: 1200,
          height: 630,
          alt: settings.shareImage?.alt || `${title}${where ? ` — ${where}` : ""}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [share],
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${koulen.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
