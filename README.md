# EAM Global website

English master of eam-global.com, built from `EAM-Global-Website-Content-v1.pdf`
(kept locally, not in git). First draft: English only, Brazil featured.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are static)
npm run geo        # regenerate the map artwork in public/art and src/lib/geo-data.ts
```

## How it is organised

| Path | What lives there |
| --- | --- |
| `src/content/` | All copy, program tables, navigation and SEO titles. Edit text here, not in components. |
| `src/app/` | One folder per page (`/residence-by-investment/brazil`, `/why-eam-global`, …). |
| `src/components/home/` | Homepage sections. |
| `src/components/page/` | Shared page blocks: hero, tables, FAQ, country template. |
| `src/components/art/` | Code-drawn visuals: maps, stamps, boarding pass, roadmap document. |
| `scripts/build-geo.mjs` | Builds the maps from Natural Earth data (public domain). |

### Placeholders

Text in `{{double braces}}` inside `src/content/` is a value the client must confirm
(licence number, Brazil thresholds, team names, prices…). It renders with a yellow
dashed highlight. Nothing highlighted may go live: search the content folder for `{{`.

### Visuals

The founder photo and logo are the client's own. Every other photo in `src/assets/stock/`
is a temporary stand-in under the Unsplash License (see `CREDITS.md` there); replace them
with EAM Global's own photography before launch. Maps come from public-domain Natural Earth data.

### Motion

- Smooth scrolling: [Lenis](https://github.com/darkroomengineering/lenis); scroll-linked
  effects: GSAP ScrollTrigger. Both load only on fast connections
  (`src/components/motion/motion-provider.tsx`).
- Effects are declared with data attributes: `data-parallax`, `data-hero-fade`,
  `data-stack` / `data-stack-card` (stacking cards) and `data-zoom-in`.
- Scroll reveals (blur-up) and heading reveals are CSS, triggered by the head script, so
  they never wait for JavaScript bundles.

## Slow networks (2G / 3G / Data Saver)

An inline script in `<head>` (`src/lib/boot-script.ts`) reads the browser's Network
Information API before first paint and sets `<html data-net="lite">` on 2G, 3G or Data Saver:

- system fonts instead of web fonts (no font downloads),
- no smooth scrolling and no GSAP (neither library is downloaded),
- no scroll or load animations, every section visible immediately,
- decorative layers (grain, glows, live pings) removed,
- no background prefetching of other pages (`AppLink`).

Safari and Firefox do not expose the API, so the default experience is built light:
static pages, AVIF images, map artwork as cached files and menus that mount on first use.
Motion also switches off for visitors who ask for reduced motion.

## Chat assistant (Groq)

A floating "Ask a question" button opens an AI assistant that answers from the copy in
`src/content/` and hands visitors to WhatsApp or the free roadmap.

- Setup: copy `.env.example` to `.env.local` and set `GROQ_API_KEY`
  ([console.groq.com/keys](https://console.groq.com/keys)). On Vercel, add it under
  Project → Settings → Environment Variables. The key is only read on the server.
- Model: `openai/gpt-oss-120b` with medium reasoning by default; `GROQ_MODEL` and
  `GROQ_REASONING` change them (low reasoning was faster but dropped items from lists).
- What it knows: `src/lib/chat/knowledge.ts` builds the system prompt from the content
  files, so editing copy updates the bot. `{{placeholders}}` reach it as "[not confirmed]"
  and it refers those questions to an advisor.
- Pieces: `src/app/api/chat/route.ts` (streams the reply, caps length and history,
  per-visitor rate limit), `src/components/chat/` (button + panel; the panel downloads
  only when first opened).
- Limits: each message sends about 4,500 prompt tokens. Groq's free tier allows 8,000 tokens
  a minute, so it only handles about one message a minute: enough for testing, not for visitors.

## Before launch

- Move Groq to the paid Developer plan (about USD 1 per 1,000 chat messages at today's
  prices) and replace the in-memory chat rate limit with a shared store. Mention Groq
  as a processor of chat messages in the privacy policy.

- Wire `src/app/api/enquiry/route.ts` to the CRM and the on-duty advisor's WhatsApp.
  Today it only validates and acknowledges; submissions are not stored.
- Fill every `{{placeholder}}`, re-verify every program figure, and have the
  No Win, No Fee wording reviewed by a UAE lawyer.
- Add the founder-and-client videos with English and Portuguese caption files.
- Portuguese (`/pt/`) and Arabic (`/ar/`, right-to-left) once the English master is approved.
