import "server-only";

/**
 * Environment configuration. Every integration is optional so the site runs
 * locally without accounts; see .env.example for the full list.
 *
 * Supabase is connected through the Vercel Marketplace or by hand; both
 * provide NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and
 * SUPABASE_SERVICE_ROLE_KEY.
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  resendApiKey: process.env.RESEND_API_KEY ?? "",
  leadNotificationEmail: process.env.LEAD_NOTIFICATION_EMAIL ?? "",
  /** Sender for notification emails — no default on purpose; see emailFromProblem(). */
  emailFrom: (process.env.EMAIL_FROM ?? "").trim(),

  calcomWebhookSecret: process.env.CALCOM_WEBHOOK_SECRET ?? "",

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const isSupabaseConfigured = () => Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
export const isEmailConfigured = () => Boolean(env.resendApiKey && env.leadNotificationEmail);

/** "Name <address@domain>" or a bare "address@domain". */
const SENDER_FORMAT = /^(?:[^<>]+<\s*[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+\s*>|[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)$/;

/**
 * Checks EMAIL_FROM. The sender is never guessed or hard-coded, so the site
 * can't silently send from the wrong address or domain. Returns a
 * human-readable problem, or null when the value looks usable.
 */
export function emailFromProblem(): string | null {
  if (!env.emailFrom) {
    return 'EMAIL_FROM is not set. Set it to the sender address, e.g. "Your Company <quotes@example.com>".';
  }
  if (!SENDER_FORMAT.test(env.emailFrom)) {
    return `EMAIL_FROM is not a valid sender ("${env.emailFrom}"). Use "Name <address@domain>" or "address@domain".`;
  }
  return null;
}
