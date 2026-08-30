import type { Image } from "sanity";

export interface SiteSettings {
  title: string;
  editionNumber?: number;
  heroImage?: Image | null;
  eventDate?: string;
  rainDate?: string;
  location?: string;
  intro?: string;
  registrationUrl?: string;
  registrationOpen?: boolean;
  registrationLabel?: string;
  registrationClosedLabel?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  contactEmail?: string;
  photoCredit?: string;
}

export interface ProgramItem {
  _id: string;
  title: string;
  time: string;
  endTime?: string;
  description?: string;
  location?: string;
  category?: string;
  image?: Image | null;
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
  coverImage?: Image | null;
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
  introPhotos?: Image[];
  stats?: Stat[];
  closingHeading?: string;
  closingText?: string;
  closingImage?: Image | null;
}
