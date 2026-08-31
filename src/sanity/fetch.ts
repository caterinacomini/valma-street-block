import { draftMode } from "next/headers";

import { client, previewClient } from "./client";
import {
  howToArriveQuery,
  pastEditionsQuery,
  programItemsQuery,
  regulationQuery,
  homeContentQuery,
  siteSettingsQuery,
  sponsorsQuery,
} from "./queries";
import {
  FALLBACK_HOME,
  FALLBACK_HOW_TO_ARRIVE,
  FALLBACK_PAST_EDITIONS,
  FALLBACK_PROGRAM,
  FALLBACK_REGULATION,
  FALLBACK_SITE_SETTINGS,
} from "./fallbacks";
import type {
  HomeContent,
  HowToArrive,
  PastEdition,
  ProgramItem,
  Regulation,
  SiteSettings,
  Sponsor,
} from "./types";


/**
 * Sanity hands back null for every field an editor has not filled in, so a
 * document that exists but is half written would blank the section it feeds.
 * These merge over the fallback one field at a time, counting empty strings and
 * empty arrays as unfilled too — a saved draft can never wipe the page.
 */
function merged<T extends object>(
  value: Partial<T> | null | undefined,
  fallback: T,
): T {
  if (!value) return fallback;
  const out = { ...fallback };
  for (const [key, v] of Object.entries(value)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    (out as Record<string, unknown>)[key] = v;
  }
  return out;
}

async function safeMerge<T extends object>(
  fetcher: () => Promise<Partial<T> | null | undefined>,
  fallback: T,
): Promise<T> {
  try {
    return merged(await fetcher(), fallback);
  } catch {
    return fallback;
  }
}

async function safeFetch<T>(
  fetcher: () => Promise<T | null | undefined>,
  fallback: T,
): Promise<T> {
  try {
    const result = await fetcher();
    if (result === null || result === undefined) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result;
  } catch {
    return fallback;
  }
}

/**
 * Which Sanity to ask. Draft Mode is on only inside the Studio's preview pane,
 * and the docs are explicit that reading it leaves every other visitor on the
 * cached page — so this fork costs them nothing. The try/catch is for the
 * places with no request to read: the build, and scripts.
 */
async function activeClient() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled ? previewClient : client;
  } catch {
    return client;
  }
}

async function getSiteSettings() {
  return (await activeClient()).fetch<SiteSettings | null>(siteSettingsQuery);
}

async function getProgramItems() {
  return (await activeClient()).fetch<ProgramItem[]>(programItemsQuery);
}

async function getSponsors() {
  return (await activeClient()).fetch<Sponsor[]>(sponsorsQuery);
}

async function getPastEditions() {
  return (await activeClient()).fetch<PastEdition[]>(pastEditionsQuery);
}

async function getRegulation() {
  return (await activeClient()).fetch<Regulation | null>(regulationQuery);
}

async function getHomeContent() {
  return (await activeClient()).fetch<HomeContent | null>(homeContentQuery);
}

async function getHowToArrive() {
  return (await activeClient()).fetch<HowToArrive | null>(howToArriveQuery);
}

export async function loadSiteSettings() {
  return safeMerge(getSiteSettings, FALLBACK_SITE_SETTINGS);
}

export async function loadProgramItems() {
  return safeFetch(getProgramItems, FALLBACK_PROGRAM);
}

export async function loadSponsors() {
  return safeFetch(getSponsors, []);
}

export async function loadPastEditions() {
  return safeFetch(getPastEditions, FALLBACK_PAST_EDITIONS);
}

export async function loadRegulation() {
  return safeMerge(getRegulation, FALLBACK_REGULATION);
}

export async function loadHomeContent() {
  return safeMerge(getHomeContent, FALLBACK_HOME);
}

export async function loadHowToArrive() {
  return safeMerge(getHowToArrive, FALLBACK_HOW_TO_ARRIVE);
}
