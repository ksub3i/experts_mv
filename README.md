# The Experts — website

Next.js 16 (App Router) + Tailwind CSS 4. The layout is modelled on the structure of strawhatrenovations.ca, with an original design.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Pages
`/` · `/about` · `/services` (cards deep-link to `#service-<slug>` slides) · `/gallery` · `/faq` · `/contact` · `/estimate` (multi-step estimate questionnaire + consultation booking) · `/projects/[slug]` (one template, generated for every project in `src/content/projects.ts`)

## Brand (applied from `Brand Guidelines.pdf` v1.0)
| What | Where |
|---|---|
| Colours (Navy, White, Crimson, Turquoise) | `src/app/globals.css` → `@theme` tokens |
| Logos (master SVGs from `/Logos`) | `public/brand/`, used via `src/components/ui/Logo.tsx` |
| Favicons | `src/app/icon.png`, `src/app/apple-icon.png` |
| Fonts | `src/app/layout.tsx`: Archivo for display headings; General Sans (brand font, self-hosted from `src/fonts`) for body text |
| Business details, nav, CTA label, stats, values, mission | `src/content/site.ts` |
| Services (draft) / projects / reviews / FAQ | `src/content/*.ts` |
| Social links | `src/content/site.ts` → `socials` (shown in the footer) |
| Photos | **Temporary Unsplash stock photos** in `src/content/images.ts`. Replace them with your own photos: put the files in `public/photos/`, set `src: "/photos/…"`, then remove the Unsplash entry from `next.config.ts` |

`--color-accent` (#D3172A) is a slightly deeper crimson used for buttons and small red text, because the exact brand crimson (#EB1C30, `--color-brand-red`) is 4.4:1 against white, just under the WCAG AA minimum of 4.5:1 for small text. The exact crimson is used for large text and decorative elements.

Search for `PLACEHOLDER`, `DRAFT` and `[` (e.g. `[Island]`) to find remaining stand-in content.

## Estimate questionnaire & lead pipeline
`/estimate` runs an 8-step questionnaire, then a 9th step that thanks the customer and shows the Cal.com booking calendar (inline embed, prefilled with name/email/phone, hidden request ID + reference as booking metadata). After booking it shows a "Consultation booked" summary; customers can also "Skip — I'll book later". If Cal.com can't load, it falls back to a direct booking link and the phone number. Booking never affects the already-saved request.

| Part | Where |
|---|---|
| Questions, options, work types per category | `src/features/estimate/options.ts` |
| Validation (per step + server) | `src/features/estimate/schema.ts` |
| UI | `src/features/estimate/*.tsx` |
| Save request | `POST /api/estimates` → `submit_quote_request()` in Postgres (one transaction) |
| Photo uploads | `POST /api/estimates/uploads` issues signed URLs; files go straight to the private Supabase Storage bucket `quote-uploads` |
| Email alert to the team | `src/lib/integrations/notifications.ts` (Resend) |
| Booking sync | `POST /api/webhooks/calcom` → `consultation_bookings` (signature-checked; duplicate/late events ignored; reschedules mark the old booking `rescheduled`); lead status moves to `consultation_booked`. Rules in `src/lib/integrations/calcom.ts` |

Without credentials everything still runs locally: requests are logged to the console, uploads are switched off, and step 9 shows the phone number.

### Database (Supabase)
The schema lives in `supabase/migrations/`. Make every schema change as a new migration file; never edit the database by hand.

Tables: `customers`, `quote_requests` (the lead, with `status`), `quote_request_files`, `consultation_bookings`, `lead_notes`, `lead_status_history` (written automatically), `projects`, `integration_links` (CRM IDs). Row Level Security is on for every table with no public access; the site uses the service-role key on the server only.

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

### Go-live checklist
1. Create a Supabase project, run the migration (above), and add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
2. Create a Resend account and set `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL` and `EMAIL_FROM` (the sender, e.g. `Your Company <quotes@example.com>`; no default is built in). Until your domain is chosen and verified in Resend, `onboarding@resend.dev` works for testing but only delivers to your Resend account email.
3. Create the Cal.com event (30 min, Google Meet, phone question required) and set `NEXT_PUBLIC_CALCOM_LINK` to its public link (`username/event-slug`). In Cal.com → Settings → Developer → Webhooks, add `https://<your-site>/api/webhooks/calcom` with a secret (events: booking created, rescheduled, cancelled, meeting ended) and set the same value as `CALCOM_WEBHOOK_SECRET`. The webhook URL must be publicly reachable — Vercel-protected preview URLs are not.
4. Fill in the FAQ answers marked `draft: true` in `src/content/faq.ts` (search for `[`).

See `.env.example` for every variable.

## Architecture for future features
- **CMS / portfolio:** pages read content only through `src/lib/content` (async functions). Re-implement them against a CMS and the UI stays the same.
- **Admin dashboard / CRM:** the database already has lead statuses, notes, status history, bookings, projects and `integration_links` for external CRM IDs. Add RLS policies for staff logins when building the dashboard.
- **Lead destinations:** `src/lib/integrations/leads.ts` defines a `LeadService` interface; add adapters there (e.g. push to a CRM).
- New capabilities go in their own `src/features/<name>` module.
