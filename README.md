# Valma Street Block

Sito dell'evento di arrampicata urbana di Valmadrera (LC).
Next.js 16 (App Router) + Tailwind v4, contenuti da Sanity.

## Sviluppo

```bash
npm install
npm run dev
```

Il sito parte su http://localhost:3000.

Senza credenziali Sanity il sito **funziona comunque**: ogni sezione mostra
contenuti di fallback con i dati reali dell'evento (vedi `src/sanity/fetch.ts`).

## Contenuti (Sanity)

Lo Studio **non** è dentro il sito: è ospitato da Sanity su un dominio dedicato.
Sanity 6 e Next 16 non possono condividere lo stesso bundle — `@sanity/sdk-react`
pubblica JSX non compilato e `swr` non espone il default export lato server.
Gli schemi restano in `src/sanity/schemaTypes/` e si pubblicano da qui.

```bash
npm run studio:dev      # Studio in locale su :3333
npm run studio:deploy   # pubblica su https://valma-street-block.sanity.studio
```

### Variabili d'ambiente

Copia `.env.local.example` in `.env.local` e compila:

| Variabile | Descrizione |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del progetto Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Di norma `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Data della versione API, es. `2025-01-01` |

Le stesse vanno impostate nel progetto Vercel per il deploy.

## Struttura

Una sola landing page con sezioni ancorate (`src/app/(site)/page.tsx`):
hero → intro → programma → come arrivare → edizioni passate → regolamento →
CTA → partner.

- `src/components/sections/` — le sezioni della pagina
- `src/components/smooth-scroll.tsx` — GSAP ScrollSmoother; l'header legge la
  posizione via ScrollTrigger perché lo smoother sostituisce lo scroll nativo
- `src/components/arrival-map.tsx` — mappa dei percorsi animata allo scroll
- `src/sanity/` — client, query GROQ, schemi e contenuti di fallback

## Deploy

```bash
npm run build   # deve passare prima di ogni deploy
```
