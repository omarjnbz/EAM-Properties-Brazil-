# EAM Global website

English master of the EAM Global site, live at https://www.eam-global.lat, built from `EAM-Global-Website-Content-v1.pdf`
(kept locally, not in git). First draft: English only, Brazil featured.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are static)
npm run geo        # regenerate the map artwork in public/art and src/lib/geo-data.ts
npm run guides:pdf # print the free country guides to public/guides (needs the site running)
```

`guides:pdf` defaults to `http://localhost:3000`; use `SITE_URL=http://localhost:3100 npm run guides:pdf`
for another port, and `CHROME_PATH=...` if Chrome is not in the default macOS location.

## How it is organised

| Path | What lives there |
| --- | --- |
| `src/content/` | All copy, program tables, navigation and SEO titles. Edit text here, not in components. |
| `src/app/` | One folder per page (`/residence-by-investment/brazil`, `/why-eam-global`, …). |
| `src/components/home/` | Homepage sections. |
| `src/components/page/` | Shared page blocks: hero, tables, FAQ, country template. |
| `src/components/art/` | Code-drawn visuals: maps, stamps, boarding pass, roadmap document. |
| `scripts/build-geo.mjs` | Builds the maps from Natural Earth data (public domain). |

### Sales pages and lead capture

| Page | Purpose |
| --- | --- |
| `/refused-visa` | For people refused before: why files fail, how we reapply, any passport. |
| `/guides`, `/guides/brazil`, `/guides/argentina` | Free country guides (newsletter signup): name, email, contact number and job unlock the PDF. |
| `/podcast` | YouTube episodes with click-to-play previews. Add episodes in `src/content/podcast.ts`. |
| `/free-roadmap` | The personal roadmap form. `?destination=brazil` and `?goal=refused` preselect it. |

Social accounts (YouTube, Instagram, TikTok) live in `SOCIAL` in `src/content/site.ts`; until a URL
is set they show as "coming soon". Founder facts (years, arrival in Brazil) live in `FOUNDER` there too.

The guide PDFs are printed from `/guides/<country>/print`, using the same facts as the country pages.
Edit `src/content/guides.ts` or the country copy, then run `npm run guides:pdf` again.

### Search engines

`sitemap.xml`, `robots.txt`, a share image for every page (`src/app/opengraph-image.jpg`) and
structured data (business details, breadcrumbs, FAQs, the client film) are generated from the content.
Unconfirmed `{{placeholders}}` are kept out of the structured data.

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

## Deploying on Vercel

The site is live on Vercel (project `eam-properties-brazil`, production branch `main`) at
https://www.eam-global.lat; the bare eam-global.lat and the vercel.app address redirect there.

Environment variables (**Settings → Environment Variables**, see `.env.example`):

| Variable | Needed for |
| --- | --- |
| `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` | Form leads. Required: without them production forms send visitors to WhatsApp. See "Website leads". |
| `OPENAI_API_KEY` (+ optional `OPENAI_MODEL`, `OPENAI_REASONING`) | Daniel, the AI chat. Without the key Daniel is hidden. |
| `SITE_INDEXABLE=true` | Lets Google index the site. Set only once no `{{placeholder}}` is left. |
| `NEXT_PUBLIC_SITE_URL` | Only when the site moves domain. Defaults to https://www.eam-global.lat. |
| `ADMIN_PASSWORD` | The admin panel at `/admin` (at least 10 characters). Without it the panel stays locked. See "Admin panel". |
| `OPENAI_ADMIN_KEY` | AI usage and cost in the admin panel (an OpenAI **admin** key, read-only use). Mark it *Sensitive*. |
| `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REFRESH_TOKEN` (+ optional `GOOGLE_CALENDAR_ID`) | The site's own booking calendar on /book and /contact. Without them the live site shows Google's booking page instead. See "Booking calendar". Mark them *Sensitive*. |

Environment variables apply on the next deployment: redeploy after changing one.

Vercel's free Hobby plan is for non-commercial use; the live business site needs a Pro plan
(also required for the conversion events below).

## Website leads

Leads reach the team without a CRM: the AI does the sorting.

- **Forms** (roadmap, contact, guide download, and the chat's "Plan my move" questions) go to
  `/api/enquiry`.
- **The AI chat**: when a visitor types a phone number or email, `/api/chat` turns the
  conversation into a lead before it replies.

Both add an **AI score** (hot / warm / cold) and a **two-line AI summary**
(`src/lib/chat/lead.ts`), then post the lead as JSON to `LEADS_WEBHOOK_URL`
(`src/lib/leads.ts`). Chat leads also carry the transcript. The visitor sees "success", or
the assistant confirms, only after delivery; otherwise they are asked to message WhatsApp.
Today the webhook is a Google Sheet:

1. Create a Google Sheet (e.g. "EAM Global website leads") with the account that should own the leads.
2. **Extensions → Apps Script**, replace the code with `scripts/leads-webhook.gs`, save.
3. **Project Settings → Script properties**: add `SECRET` (a long random string) and
   `NOTIFY_EMAIL` (who gets an email per lead, comma-separated).
4. **Deploy → New deployment → Web app**: execute as *Me*, access *Anyone*. Authorise, then
   copy the web app URL (ends in `/exec`). Opening it in a browser should show `{"ok":true,...}`.
5. On Vercel set `LEADS_WEBHOOK_URL` (that URL) and `LEADS_WEBHOOK_SECRET` (the same secret), then redeploy.
6. Send a test from /contact: a row appears in the "Leads" tab and the email arrives.

After editing the script (for example the November 2026 version, which adds the AI score,
AI summary and chat transcript columns and the "AI chat (Daniel)" lead type), use
**Deploy → Manage deployments → Edit → New version** so the URL stays the same. To move to a CRM later, point `LEADS_WEBHOOK_URL` at its webhook.

The admin panel reads the newest leads back from the same web app with a GET
(`?action=list&limit=50&secret=…`, server to server only). Rows come back only when the
script's `SECRET` is set and matches. Scripts deployed before this mode existed just answer
the health check, and the panel asks for the update (a New version, as above).

## Booking calendar

/book (and the Book a call section on /contact) books the paid 30-minute video call with the
founder in the site's own design: days and times in the visitor's time zone, then name, email
and WhatsApp. It reads and writes his Google Calendar directly (`src/lib/booking/`):

- free times = his schedule (`BOOKING.schedule` in `src/content/site.ts`: Mon–Sat, 10:00–17:00
  Dubai time, 4 hours' notice, 30 days ahead) minus his calendar's busy times, so bookings made
  through Google's own booking page are respected too;
- a booking creates the event with a Google Meet link and emails the visitor Google's invitation,
  and the lead goes to the team (type `booking`, with the AI score and summary).

Three modes: **google** (the keys below are set), **preview** (no keys, off production: sample
times, nothing booked), **off** (no keys in production: Google's booking page is shown instead).

Connecting it, once:

1. In [Google Cloud Console](https://console.cloud.google.com), create a project and enable the
   **Google Calendar API**.
2. **APIs & Services → OAuth consent screen**: External, add the founder's Google account as a
   user, then **Publish app** (in "Testing", refresh tokens expire after 7 days).
3. **Credentials → Create credentials → OAuth client ID**, type *Web application*, with
   `https://developers.google.com/oauthplayground` as an authorised redirect URI.
4. In the [OAuth Playground](https://developers.google.com/oauthplayground), ⚙️ → *Use your own
   OAuth credentials* (the client ID and secret), authorise the scopes
   `https://www.googleapis.com/auth/calendar.events` and
   `https://www.googleapis.com/auth/calendar.freebusy` **signed in as the founder**, then
   *Exchange authorization code for tokens* and copy the refresh token.
5. On Vercel set `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET` and
   `GOOGLE_CALENDAR_REFRESH_TOKEN` (Production, *Sensitive*), then redeploy.

## Admin panel

`/admin` (English only, never indexed, outside the language routes) shows, behind one shared
password (`ADMIN_PASSWORD`):

- **AI usage and cost** for the last 30 days, from OpenAI's organization Costs and Usage APIs
  (`OPENAI_ADMIN_KEY`; `src/lib/admin/openai-usage.ts`). OpenAI's cost data can lag by a few hours.
- **Leads** from the Sheet, newest first, with the AI score, summary and chat transcript.
- **Daniel**: which AI answers, which keys are set (never their values) and his full instructions.

Sessions last 7 days in an HTTP-only cookie signed with the password (`src/lib/admin/session.ts`);
changing `ADMIN_PASSWORD` logs everyone out. The keys never reach the browser.

## Analytics

`src/components/analytics/site-analytics.tsx` loads Vercel Web Analytics (visits) and
Speed Insights (real visitors' loading speed); both must also be enabled in the Vercel
dashboard. Conversion events (Pro plan): **Lead** (a delivered form, with type, destination
and goal; sent from the server), **WhatsApp click**, **Call click**, **Email click** and
**Guide PDF click** (with the page and where the link sat).

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

## Chat assistant (Daniel, on OpenAI)

Daniel, the AI guide, answers from the copy in `src/content/` (plus a few facts the site
doesn't show) and hands visitors to WhatsApp, the free roadmap or the video call.

- Setup: set `OPENAI_API_KEY` ([platform.openai.com/api-keys](https://platform.openai.com/api-keys))
  in `.env.local`, and on Vercel under Project → Settings → Environment Variables (Production),
  then redeploy. The key is only read on the server. Without it Daniel is hidden.
- Model: `gpt-6-luna` (`OPENAI_MODEL`) with low reasoning (`OPENAI_REASONING`), and a prompt
  cache key so the long system prompt is billed at the cached rate after the first message.
  The Groq backup was removed in November 2026.
- Cost, November 2026 prices: about USD 0.15–0.20 per 1,000 follow-up messages and about
  USD 0.80 per 1,000 first messages. The server log prints `[chat] openai tokens: …` for
  each reply, and `[chat] openai error <status>` when OpenAI refuses (401: wrong key,
  429: no credit or rate limit).
- What it knows: `src/lib/chat/knowledge.ts` builds the system prompt from the content
  files, so editing copy updates Daniel. `{{placeholders}}` reach it as "[not confirmed]"
  and it refers those questions to an advisor.
- Pieces: `src/app/api/chat/route.ts` (streams the reply, caps length and history,
  per-visitor rate limit, lead capture), `src/components/chat/` and `src/components/daniel/`
  (the chat window and Daniel's buttons).
- OpenAI's free tier cannot use `gpt-6-luna`: the account needs prepaid credit.

## Before launch

- Before switching the chat on for visitors: keep prepaid credit on OpenAI, replace the
  in-memory chat rate limit with a shared store, and name OpenAI as a processor of chat
  messages in the privacy policy.

- Optionally move leads from the Google Sheet to a CRM (change `LEADS_WEBHOOK_URL`) and add
  an instant WhatsApp alert for the on-duty advisor.
- Fill every `{{placeholder}}`, re-verify every program figure, and have the
  No Win, No Fee wording reviewed by a UAE lawyer.
- Add the founder-and-client videos with English and Portuguese caption files.
- Portuguese (`/pt/`) and Arabic (`/ar/`, right-to-left) once the English master is approved.
