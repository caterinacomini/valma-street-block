import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "Valma Street Block",
  description:
    "Valma Street Block: la gara di arrampicata urbana tra le vie di Valmadrera.",
};

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
