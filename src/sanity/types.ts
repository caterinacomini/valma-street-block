import type { Image } from "sanity";

import type { SectionChoice } from "@/lib/sections";

/** A photograph plus the alt text the editor wrote for it. */
export type SanityPhoto = Image & { alt?: string };

/**
 * The hero, which is cropped so differently across widths that one focal point
 * cannot serve them all: these nudge it horizontally, and fall back to the
 * hotspot wherever they are left empty.
 */
export type HeroPhoto = SanityPhoto & {
  focusPhone?: number;
  focusTablet?: number;
  focusDesktop?: number;
};

export interface SiteSettings {
  title: string;
  editionNumber?: number;
  heroImage?: HeroPhoto | null;
  eventDate?: string;
  rainDate?: string;
  postponed?: boolean;
  postponedNote?: string;
  location?: string;
  intro?: string;
  registrationUrl?: string;
  registrationOpen?: boolean;
  registrationLabel?: string;
  registrationClosedLabel?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  contactEmail?: string;
  organizers?: string;
  patronage?: string;
  photoCredit?: string;
  shareImage?: SanityPhoto | null;
  sections?: SectionChoice[];
  sponsorEyebrow?: string;
  sponsorHeading?: string;
  showSponsors?: boolean;
}

export interface ProgramItem {
  _id: string;
  title: string;
  time: string;
  endTime?: string;
  description?: string;
  location?: string;
  category?: string;
  image?: SanityPhoto | null;
}

export interface Sponsor {
  _id: string;
  name: string;
  logo?: Image | null;
  url?: string;
  tier?: string;
}

export interface PastEdition {
  _id: string;
  year: number;
  editionNumber?: number;
  coverImage?: SanityPhoto | null;
  gallery?: Image[];
  highlights?: string;
  participantsCount?: number;
}

export interface FaqCategory {
  title: string;
  items: { question: string; answer: string }[];
}

export interface Regulation {
  title?: string;
  faq?: FaqCategory[];
  pdfLabel?: string;
  pdfUrl?: string | null;
  updatedAt?: string;
}

export interface HowToArrive {
  intro?: string;
  address?: string;
  carInfo?: string;
  publicTransportInfo?: string;
  mapEmbedUrl?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface HomeContent {
  introHeading?: string;
  introText?: string;
  claim?: string;
  claimText?: string;
  introPhotos?: SanityPhoto[];
  stats?: Stat[];
  closingHeading?: string;
  closingText?: string;
  closingImage?: SanityPhoto | null;
}
