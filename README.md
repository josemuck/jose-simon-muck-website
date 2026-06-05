# Jose Simon Muck — Personal Website

> Executive personal website and editorial platform for Jose Simon Muck — Product, Strategy & International Growth leader.

**Live site:** [josemuck.com](https://josemuck.com)

---

## Overview

A hand-crafted static website built without frameworks or dependencies. It serves as both an executive profile and an editorial hub — publishing long-form perspectives on product strategy, organizational transformation, and international digital growth.

The site is designed for discoverability through content: readers arrive via articles and discover the author's background naturally through the experience.

---

## Structure

```
/
├── index.html                  # Main profile page (About, Experience, Impact, Beyond the Work)
├── perspectives.html           # Editorial hub — all published perspectives
├── article-*.html              # 15 individual article pages
├── impressum.html              # German Impressum (§ 5 DDG)
├── privacy.html                # Datenschutzerklärung / Privacy Policy (GDPR/DSGVO)
├── favicon.svg                 # JM monogram favicon (Statesman identity)
├── assets/
│   ├── brand/
│   │   ├── jm-primary.svg      # JM monogram — Statesman Silver, for dark backgrounds
│   │   ├── jm-ink.svg          # JM monogram — Ink Green, for light backgrounds
│   │   ├── jm-emerald.svg      # JM monogram — Signal Emerald, accent use only
│   │   ├── apple-touch-icon.svg  # Home screen icon
│   │   └── og-image.svg        # Social preview card (1200×630)
│   ├── js/
│   │   ├── consent.js          # GDPR consent manager + Vercel Analytics gating
│   │   ├── perspectives-data.js  # Centralized article metadata (source of truth)
│   │   └── article-nav.js      # Dynamic prev/next + related perspectives renderer
│   └── images/
│       └── articles/           # Editorial illustrations (PNG, 15 articles)
```

---

## Content

**15 published perspectives** organized across three thematic areas:

| Theme | Articles |
|---|---|
| Strategic Foundations | Product Strategy in Complex Organizations · AI and the Future of Workflows · International Digital Growth Beyond Localization · People-Centered Transformation |
| Organizational Reality | Most Product Advice Assumes Functional Organizations · Empowered Teams Are Not a Process · The Most Important Product Skill Is Organizational Translation · Frameworks Don't Survive Organizational Reality · The Product Manager Is Often the Least Powerful Person in the Room · Why International Organizations Cannot Be Managed Like Silicon Valley Startups |
| Transformation Under Pressure | Transformation Does Not Happen in a Vacuum · Ship or Die · When Transformation Starts Feeling Like Friction · Transformation Is Not the Goal. Competitiveness Is. · The Most Dangerous Transformation Illusion Is Thinking Time Exists |

---

## Technical Choices

- **No framework, no build step.** Pure HTML, CSS, and vanilla JavaScript. Deployed as-is.
- **Data-driven article pages.** `perspectives-data.js` is the single source of truth for all article metadata (title, category, image, related articles, read time). Both the editorial hub and the dynamic prev/next + related navigation read from this file — no duplication.
- **Performance.** Hero images use `loading="eager"`, all others `loading="lazy"`. Images are served as optimized PNGs.
- **Scroll animations.** `IntersectionObserver` drives reveal animations with no layout shift.

---

## Deployment

Deployed on [Vercel](https://vercel.com) with automatic deployments from the `main` branch. No build configuration required — the repo root is the publish directory.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--navy` | `#0a0f1e` | Page background |
| `--graphite` | `#111827` | Card / section backgrounds |
| `--graphite-light` | `#1a2236` | Hover states |
| `--off-white` | `#e8e8e4` | Primary text |
| `--muted` | `#8892a4` | Secondary text, labels |
| `--green` | `#4ade80` | Accent, CTAs, hover |
| `--border` | `rgba(255,255,255,0.06)` | Dividers |

Typography: **Playfair Display** (display/editorial) · **DM Sans** (body) · **DM Mono** (labels/metadata)

---

## Vercel Web Analytics

### How it is loaded

This is a **static HTML site** — no bundler, no `package.json`. Vercel Analytics is implemented via a consent-gated dynamic script injection in `assets/js/consent.js`.

**Script path (verified):** `/_vercel/insights/script.js`

This path is served directly by Vercel's CDN once Web Analytics is enabled in the project dashboard. No npm package is installed or required.

### Implementation pattern

`consent.js` initialises the `window.va` queue stub immediately when loaded (before any user interaction), then injects the analytics script only after explicit user consent:

```js
// 1. Queue stub — runs immediately on page load (no consent required)
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

// 2. Gated loader — only called after analytics consent is granted
function loadAnalytics() {
  var s = document.createElement('script');
  s.defer = true;
  s.src   = '/_vercel/insights/script.js';
  document.head.appendChild(s);
}
```

When the script loads after consent, it initialises `window.va` fully and replays any calls queued in `window.vaq`.

### Where the script path is configured

**One place only:** `assets/js/consent.js`, inside the `loadAnalytics()` function.

```js
s.src = '/_vercel/insights/script.js';
```

To change the path (e.g. if Vercel updates it), edit only this line.

### Consent gating logic

| User action | Result |
|---|---|
| New visitor — no stored consent | Cookie banner shown, analytics NOT loaded |
| User clicks **Accept** | `analytics: true` written to `localStorage`, script injected once |
| User clicks **Reject** | `analytics: false` written to `localStorage`, script never injected |
| User opens Settings → saves with Analytics ON | Same as Accept |
| User opens Settings → saves with Analytics OFF | `analytics: false` saved, script NOT injected on this page load |
| Returning visitor with `analytics: true` | Script injected immediately on page load (no banner) |
| Returning visitor with `analytics: false` | Script never injected (no banner) |
| User changes from Accept → Reject (via Settings) | Preference updated; script already loaded for current page, NOT loaded on next |

**`_analyticsLoaded` guard** prevents double-injection if `loadAnalytics()` is called more than once within a session.

### Vercel dashboard requirement

> ⚠️ **Auto-injection in the Vercel dashboard MUST remain disabled.**

If "Inject Analytics Script" is enabled in the Vercel dashboard, Vercel will inject the script into every HTML response at the edge — bypassing the consent gate entirely. The site relies exclusively on the `consent.js` gated loader.

To verify: Vercel dashboard → Project → Analytics → Settings → confirm auto-injection is off.

### How to validate using DevTools Network tab

**Test: analytics loads after consent**
1. Open `josemuck.com` in a fresh browser profile (or clear `jsm_consent` from `localStorage`)
2. Open DevTools → Network tab → filter by `_vercel`
3. Verify: **no requests to `/_vercel/insights/*`** before interacting with the banner
4. Click **Accept** on the cookie banner
5. Verify: a request to `/_vercel/insights/script.js` appears (script load)
6. Navigate to another page — a request to `/_vercel/insights/view` appears (pageview event)

**Test: analytics does NOT load when rejected**
1. Fresh browser profile / clear `localStorage`
2. Open DevTools → Network → filter `_vercel`
3. Click **Reject** on the banner
4. Navigate across pages — no `/_vercel/insights` requests should appear

**Test: preference change takes effect**
1. After rejecting, open Cookie-Einstellungen (footer button)
2. Toggle Analytics ON → Save
3. Reload the page
4. Verify `/_vercel/insights/script.js` loads on the reload

**Test: inspect consent object in localStorage**
```js
// In browser console:
JSON.parse(localStorage.getItem('jsm_consent'))
// Expected after Accept:
// { version: "1.0", timestamp: "...", essential: true, analytics: true }
```

**Test: verify in Vercel dashboard**
1. Vercel dashboard → Project → Analytics
2. After accepting consent and browsing several pages, pageviews should appear within a few minutes
3. If the dashboard shows zero events despite accepting consent, check that auto-injection is disabled and that `/_vercel/insights/script.js` returns HTTP 200

---

## License

All written content and editorial illustrations are © Jose Simon Muck. All rights reserved.

---

## Legal & Compliance

> ⚠️ **Legal disclaimer:** This implementation provides a technical scaffold for GDPR/TDDDG compliance. Final review by a qualified Rechtsanwalt or Datenschutzbeauftragter is strongly recommended.

### Pages

| Page | URL | Purpose |
|---|---|---|
| `impressum.html` | `/impressum.html` | German Impressum (§ 5 DDG) |
| `privacy.html` | `/privacy.html` | Datenschutzerklärung / Privacy Policy (GDPR/DSGVO) |

### Consent System (`assets/js/consent.js`)

A lightweight vanilla JS consent manager. No external dependencies.

**Consent categories:**

| Category | Key | Default | Purpose |
|---|---|---|---|
| Essential | `essential` | `true` (always) | Consent preference storage |
| Analytics | `analytics` | `false` | Vercel Web Analytics |

**localStorage key:** `jsm_consent` (version `1.0`)

**Consent object structure:**
```json
{
  "version": "1.0",
  "timestamp": "2026-05-15T12:00:00.000Z",
  "essential": true,
  "analytics": false
}
```

**Analytics gating:** Vercel Web Analytics (`/_vercel/insights/script.js`) is only injected into the DOM after the user grants analytics consent. No tracking loads before consent.

**Re-opening settings:** Users can reopen the consent panel at any time via the "Cookie-Einstellungen" button in the footer.

### How to update when adding new services

| Service to add | Action required |
|---|---|
| **Google Analytics** | Add GA script inside `loadAnalytics()` in `consent.js`. Update privacy.html §07. Bump `VERSION` in consent.js. |
| **YouTube embeds** | Gate embed loading behind analytics consent. Update privacy.html §07. |
| **LinkedIn embeds** | Add LinkedIn as a third-party processor in privacy.html. Gate behind consent if tracking is involved. |
| **Newsletter / contact form** | Add new consent category if email marketing involved. Update privacy.html with new data processor details. |
| **Sandra AI / Chatbot** | Add chatbot as a data processor in privacy.html. Implement consent gate if the chatbot processes personal data. |

**When changing consent purposes materially:** Bump `VERSION` in `consent.js` (e.g., `"1.0"` → `"1.1"`). This invalidates stored consents and shows the banner again to returning visitors.

### Footer legal links

All pages include footer links to:
- `impressum.html` — Impressum
- `privacy.html` — Datenschutz
- Cookie-Einstellungen button (opens consent panel via `window.consentManager.openSettings()`)

### Google Analytics 4

**Measurement ID:** `G-9FH2DWH9DV`  
**Configured in:** `assets/js/consent.js` → `GA_MEASUREMENT_ID` constant (line 2 of configuration block)

#### Implementation pattern

GA4 uses **Google Consent Mode v2** with strict pre-consent gating. The `gtag` function and `dataLayer` are initialised globally in `consent.js` before any user interaction, with all consent defaulting to `denied`. The actual `gtag.js` script is only injected after the user grants analytics consent.

```
Page loads → consent.js runs
  │
  ├─ window.dataLayer initialized
  ├─ gtag() function defined
  ├─ gtag('consent', 'default', { all: 'denied' })   ← queued in dataLayer
  │
  ├─ User accepts analytics
  │   ├─ gtag('consent', 'update', { analytics_storage: 'granted' })
  │   ├─ <script async src="googletagmanager.com/gtag/js?id=G-9FH2DWH9DV"> injected
  │   └─ gtag('config', 'G-9FH2DWH9DV')  ← queued, fires page_view on script load
  │
  └─ User rejects / revokes
      └─ gtag('consent', 'update', { analytics_storage: 'denied' })
```

Advertising-related consent (`ad_storage`, `ad_user_data`, `ad_personalization`) is permanently `denied` — not used.

#### Where GA_MEASUREMENT_ID is configured

**One place only:** `assets/js/consent.js`, at the top of the file:

```js
var GA_MEASUREMENT_ID  = 'G-9FH2DWH9DV';
```

To change the ID, edit only this line.

#### Debug mode

Add `?debug_analytics=true` to any page URL to enable console logging of all consent events and analytics actions. No code change or redeployment needed.

```
https://josemuck.com/?debug_analytics=true
```

Open DevTools → Console. You will see:
- `[Analytics] Consent Mode default: all denied`
- `[Analytics] GA4 script injected, config queued for: G-9FH2DWH9DV`
- `[Analytics] User accepted all analytics`
- etc.

#### How to validate GA4 using DevTools Network tab

**Before consent — no GA4 requests should appear:**
1. Open a fresh browser profile (or run `localStorage.removeItem('jsm_consent')` in console)
2. Open DevTools → Network → filter: `google`
3. Load any page — verify no requests to `googletagmanager.com` or `google-analytics.com`

**After accepting consent — GA4 loads and fires:**
1. Click **Accept** on the cookie banner (or accept via Settings)
2. Network filter `google` → verify:
   - `gtag/js?id=G-9FH2DWH9DV` — script loaded (HTTP 200)
   - `google-analytics.com/g/collect` — pageview event sent
3. Filter `collect` for a cleaner view of GA4 hits

**After rejecting — no GA4 requests:**
1. Click **Reject** (or toggle Analytics OFF in Settings → Save)
2. Reload the page
3. Network filter `google` → no requests

**After revoking consent within a session:**
When a user turns off analytics mid-session, `gtag('consent', 'update', {analytics_storage: 'denied'})` fires immediately. GA4 will stop sending events for the remainder of the session. Verify via Console debug mode.

**Check consent object:**
```js
JSON.parse(localStorage.getItem('jsm_consent'))
// After accept: { version: "1.1", essential: true, analytics: true, timestamp: "..." }
// After reject: { version: "1.1", essential: true, analytics: false, timestamp: "..." }
```

**Verify in GA4 dashboard:**
1. GA4 → Reports → Realtime
2. After accepting consent and browsing, realtime events appear within seconds
3. If no events appear despite accepting: check Network tab for `collect` requests and confirm `analytics_storage: granted` via debug mode

#### Consent version note

The `VERSION` constant in `consent.js` was bumped from `"1.0"` to `"1.1"` when GA4 was introduced. This invalidates previously stored v1.0 consents, causing the cookie banner to re-appear for returning visitors. This is intentional — the analytics scope changed materially (GA4 added).


