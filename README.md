# Jose Simon Muck — Personal Website

> Executive personal website and editorial platform for Jose Simon Muck — Product, Strategy & International Growth leader.

**Live site:** [jose-simon-muck-website.vercel.app](https://jose-simon-muck-website.vercel.app)

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
├── assets/
│   ├── css/
│   │   └── style.css           # Single stylesheet
│   ├── js/
│   │   ├── perspectives-data.js  # Centralized article metadata (source of truth)
│   │   ├── article-nav.js        # Dynamic prev/next + related perspectives renderer
│   │   └── main.js               # Scroll animations, reading progress bar
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
- **Single CSS file.** All styles in `assets/css/style.css` using custom properties for the design system.
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

Typography: **Playfair Display** (display/editorial) · **Inter** (body) · **DM Mono** (labels/metadata)

---

## License

All written content and editorial illustrations are © Jose Simon Muck. All rights reserved.
