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
  emailFrom: process.env.EMAIL_FROM ?? "The Experts <onboarding@resend.dev>",

  calcomWebhookSecret: process.env.CALCOM_WEBHOOK_SECRET ?? "",

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const isSupabaseConfigured = () => Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
export const isEmailConfigured = () => Boolean(env.resendApiKey && env.leadNotificationEmail);
