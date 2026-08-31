/**
 * Fills an empty dataset with what the site is already showing.
 *
 * Until this runs, every word on the site comes from the fallbacks in
 * fetch.ts, and the Studio opens on nothing — which makes it impossible to tell
 * whether an edit did nothing because the field is unwired or because the
 * document does not exist. Seeding removes that ambiguity: from here the
 * Studio is the source, and the fallbacks only cover Sanity being unreachable.
 *
 * The content is imported rather than transcribed, so the two cannot drift.
 * Ids are fixed, so running it twice replaces rather than duplicates — but it
 * DOES overwrite, so do not run it over a dataset someone has edited.
 *
 *   SANITY_API_WRITE_TOKEN=... npx tsx scripts/seed-sanity.ts [--dry]
 *
 * Photographs are deliberately left out: uploading one is also choosing its
 * hotspot, which is a judgement no script should make.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  FALLBACK_HOME,
  FALLBACK_PAST_EDITIONS as EDITIONS,
  FALLBACK_HOW_TO_ARRIVE,
  FALLBACK_PAST_EDITIONS,
  FALLBACK_PROGRAM,
  FALLBACK_REGULATION,
  FALLBACK_SITE_SETTINGS,
} from "../src/sanity/fallbacks";

type Doc = Record<string, unknown> & { _id: string; _type: string };

/** .env.local is not loaded for us outside Next. */
function readEnv(): Record<string, string> {
  const env: Record<string, string> = { ...process.env } as Record<string, string>;
  try {
    const file = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of file.split("\n")) {
      const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (match) env[match[1]] ??= match[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no file: rely on the real environment */
  }
  return env;
}

/**
 * Sanity needs a _key on every object inside an array — without one the Studio
 * shows the list as broken and refuses to reorder it. Derived from position and
 * content rather than random, so running this twice does not churn the document.
 */
function withKeys(value: unknown, path = "k"): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      item && typeof item === "object" && !Array.isArray(item)
        ? { _key: `${path}${index}`, ...(withKeys(item, `${path}${index}-`) as object) }
        : withKeys(item, `${path}${index}-`),
    );
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [key, withKeys(inner, `${path}${key}-`)]),
    );
  }
  return value;
}

/** Strip the keys that describe the fallback rather than the content. */
function clean<T extends object>(source: T, drop: string[] = []): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (drop.includes(key) || key.startsWith("_")) continue;
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = withKeys(value, `${key}-`);
  }
  return out;
}

function documents(): Doc[] {
  const docs: Doc[] = [
    // The three singletons keep the ids the Studio's structure looks them up by
    { _id: "siteSettings", _type: "siteSettings", ...clean(FALLBACK_SITE_SETTINGS, ["heroImage"]) },
    {
      _id: "homeContent",
      _type: "homeContent",
      ...clean(FALLBACK_HOME, ["closingImage", "introPhotos", "stats"]),
      /* The fallback leaves these empty so the page can read the participant
         count off the most recent edition. Seeding them makes the numbers
         editable, which is the point of a CMS — at the cost of that link, which
         was invisible anyway: nobody expects editing an edition to move the
         home page. */
      stats: [
        {
          _key: "climbers",
          value: `+${EDITIONS[0]?.participantsCount ?? 470} climbers`,
          label: "In gara all'ultima edizione, competitivi e non.",
        },
        {
          _key: "blocchi",
          value: "+50 blocchi",
          label: "Passaggi brevi ma intensi, sparsi per il paese.",
        },
      ],
    },
    { _id: "howToArrive", _type: "howToArrive", ...clean(FALLBACK_HOW_TO_ARRIVE) },
    { _id: "regulation", _type: "regulation", ...clean(FALLBACK_REGULATION, ["pdfUrl"]) },
  ];

  FALLBACK_PROGRAM.forEach((item, index) => {
    docs.push({
      _id: `programItem-${index + 1}`,
      _type: "programItem",
      order: index + 1,
      ...clean(item, ["image"]),
    });
  });

  FALLBACK_PAST_EDITIONS.forEach((edition) => {
    docs.push({
      _id: `pastEdition-${edition.year}`,
      _type: "pastEdition",
      ...clean(edition, ["coverImage", "gallery"]),
    });
  });

  return docs;
}

async function main(): Promise<number> {
  const env = readEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
  const token = env.SANITY_API_WRITE_TOKEN;
  const dry = process.argv.includes("--dry");

  const docs = documents();
  console.log(`${docs.length} documenti da scrivere su ${projectId}/${dataset}:`);
  for (const doc of docs) {
    const label = doc.title ?? doc.year ?? doc.introHeading ?? doc._id;
    console.log(`  ${doc._type.padEnd(14)} ${doc._id.padEnd(22)} ${String(label).slice(0, 44)}`);
  }

  if (dry) {
    console.log("\n--dry: niente è stato scritto.");
    return 0;
  }
  if (!projectId) {
    console.error("\nNEXT_PUBLIC_SANITY_PROJECT_ID mancante.");
    return 1;
  }
  if (!token) {
    console.error(
      "\nSANITY_API_WRITE_TOKEN mancante.\n" +
        "Crealo su https://sanity.io/manage → API → Tokens (permessi Editor)\n" +
        "e mettilo in .env.local. Con --dry vedi cosa verrebbe scritto.",
    );
    return 1;
  }

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: docs.map((doc) => ({ createOrReplace: doc })),
      }),
    },
  );

  const body = await response.json();
  if (!response.ok) {
    console.error(`\nSanity ha rifiutato (${response.status}):`);
    console.error(JSON.stringify(body, null, 2).slice(0, 1200));
    return 1;
  }

  console.log(`\nScritti ${body.results?.length ?? docs.length} documenti.`);
  console.log("Il sito li mostra entro un minuto (revalidate = 60).");
  return 0;
}

main().then((code) => process.exit(code));
