# Valma Street Block

Sito dell'evento di arrampicata urbana di Valmadrera (LC).
Next.js 16 (App Router) + Tailwind v4, contenuti da Sanity.

- **Produzione**: https://valma-street-block.vercel.app
- **CMS**: https://valma-street-block.vercel.app/studio
- Ogni push su `main` fa partire un deploy su Vercel.
- **Retrospettiva** (come è stato costruito, e le trappole in cui siamo caduti):
  https://claude.ai/code/artifact/492e99ad-67e3-445d-8e71-0ff2a8db3d07

## Sviluppo

```bash
npm install
npm run dev
```

Serve un `.env.local` (copia `.env.local.example`):

| Variabile | Valore |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `cxwqrzsq` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-01-01` |

Le stesse tre sono impostate su Vercel (tipo **Config**, non Secret: hanno il
prefisso `NEXT_PUBLIC_` e devono essere leggibili dal browser).

Senza credenziali il sito parte lo stesso e mostra i contenuti di fallback.

## Contenuti

Lo Studio è **dentro** il sito, su `/studio`. Gli schemi stanno in
`src/sanity/schemaTypes/`, la struttura del menu in `src/sanity/structure.ts`.

Flusso di pubblicazione: scrivi nello Studio → **Publish** → il sito si aggiorna
entro ~60s (`export const revalidate = 60` sulla home). Le bozze non salvate come
pubblicate non arrivano mai al sito.

Nuovi domini vanno autorizzati in Sanity → **API → CORS origins**, con *Allow
credentials* attivo. Già autorizzati: la produzione e `http://localhost:3000`.

### Fallback: dati reali ma non tutti verificati

Ogni sezione ha contenuti di fallback in `src/sanity/fetch.ts`, usati finché il
documento corrispondente non esiste su Sanity. Servono a non mostrare mai una
pagina vuota, e vengono sostituiti sezione per sezione appena pubblichi.

Attenzione, non sono tutti verificati:

- **Verificati** (da comunicati e canali ufficiali): format a 50 blocchi, 473
  partecipanti nel 2026, 130 volontari, quote di iscrizione, orari tipo.
- **Stimati o inventati**, da correggere con i dati reali:
  - i tempi nella mappa dei percorsi (`arrival-map.tsx`): "35 min di treno",
    "15 min di bus", "5 min a piedi"
  - i partecipanti delle edizioni 2015–2024 (2025 e 2026 sono reali)
  - i nomi dei partner nella sezione sponsor, che sono placeholder

## Struttura

Una sola landing page con sezioni ancorate (`src/app/(site)/page.tsx`):
hero → intro → programma → come arrivare → edizioni passate → regolamento →
CTA → partner.

- `src/components/sections/` — le sezioni della pagina
- `src/components/smooth-scroll.tsx` — GSAP ScrollSmoother
- `src/components/arrival-map.tsx` — percorsi animati allo scroll (MotionPath)
- `src/components/edizioni-carousel.tsx` — foto che si restringe e card che
  scorrono, pinnato allo scroll
- `src/sanity/` — client, query GROQ, schemi e fallback

## Note tecniche non ovvie

**Sanity va tenuto sul canale `stable`.** Il canale `latest` (6.8+) include
`@sanity/sdk-react`, che pubblica JSX non compilato: rompe Turbopack, webpack e
la CLI di Sanity. Se un `npm update` riporta `sanity` a `latest`, la build si
rompe di nuovo. `sanity@stable` non ha quella dipendenza.

**`serverExternalPackages: ["sanity"]`** in `next.config.ts` serve perché la
build di `swr` per react-server non espone il default export.

**Lo Studio è caricato solo lato client** (`studio-client.tsx`): la sua config
contiene funzioni e componenti che non possono attraversare il confine
server/client di React.

**GSAP e ScrollSmoother.** Lo smoother sostituisce lo scroll nativo, quindi:
`window.scrollY` resta a 0 (l'header legge la posizione via ScrollTrigger), gli
anchor passano da `smoother.scrollTo`, e i pin vanno con `pinType: "transform"`.
`SmoothScroll` chiama `ScrollTrigger.refresh()` dopo l'init, perché gli effetti
dei figli girano prima di quelli del padre e misurerebbero male.

**Env non-throwing.** `src/sanity/runtime-env.ts` non lancia se mancano le
variabili: `next build` valuta quei moduli, e un throw fallirebbe la build.

## Comandi

```bash
npm run dev     # sviluppo
npm run build   # deve passare prima di ogni deploy
npm run lint
```
