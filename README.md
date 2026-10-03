# The Experts — website (placeholder phase)

Next.js 16 (App Router) + Tailwind CSS 4. The layout is modelled on the structure of strawhatrenovations.ca, with an original design. All copy and images are placeholders.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Pages
`/` · `/about` · `/services` (cards deep-link to `#service-<slug>` slides) · `/gallery` · `/contact` (quote form) · `/projects/[slug]` (one template, generated for every project in `src/content/projects.ts`)

## Brand (applied from `Brand Guidelines.pdf` v1.0)
| What | Where |
|---|---|
| Colours (Navy, White, Crimson, Turquoise) | `src/app/globals.css` → `@theme` tokens |
| Logos (master SVGs from `/Logos`) | `public/brand/`, used via `src/components/ui/Logo.tsx` |
| Favicons | `src/app/icon.png`, `src/app/apple-icon.png` |
| Fonts | `src/app/layout.tsx`: Archivo for display headings; General Sans (brand font, self-hosted from `src/fonts`) for body text |
| Business details, stats, values, mission | `src/content/site.ts` |
| Services (draft) / projects / reviews | `src/content/*.ts` |
| Social links | `src/content/site.ts` → `socials` (shown in the footer) |
| Photos | **Temporary Unsplash stock photos** in `src/content/images.ts`. Replace them with your own photos: put the files in `public/photos/`, set `src: "/photos/…"`, then remove the Unsplash entry from `next.config.ts` |

`--color-accent` (#D3172A) is a slightly deeper crimson used for buttons and small red text, because the exact brand crimson (#EB1C30, `--color-brand-red`) is 4.4:1 against white, just under the WCAG AA minimum of 4.5:1 for small text. The exact crimson is used for large text and decorative elements.

Search for `PLACEHOLDER`, `DRAFT` and `[` (e.g. `[Island]`) to find remaining stand-in content.

## Architecture for future features
- **CMS / portfolio:** pages read content only through `src/lib/content` (async functions). Re-implement them against a CMS and the UI stays the same.
- **Multi-step quote questionnaire:** add steps in `src/features/quote/steps.ts` and fields in `schema.ts`. The form renders the progress bar and Back/Continue buttons automatically.
- **Lead capture / CRM / calendar / uploads:** `/api/leads` validates the request and hands it to the `LeadService` in `src/lib/integrations/leads.ts` (currently logs to the console). Add new adapters there.
- New capabilities (booking, photo uploads) go in their own `src/features/<name>` module.
