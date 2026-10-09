/**
 * Browser-safe settings. Only NEXT_PUBLIC_* values (inlined at build time) may
 * appear here — this file is imported by client components.
 */

/**
 * Accepts "username/event-slug" or a full URL like "https://cal.com/username/event-slug"
 * and returns "username/event-slug". Empty or unusable → "" (booking step shows the phone fallback).
 */
function normaliseCalLink(value: string | undefined) {
  const link = (value ?? "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(app\.)?cal\.(com|eu)\//i, "")
    .replace(/[?#].*$/, "")
    .replace(/^\/+|\/+$/g, "");
  return /^[\w.-]+(\/[\w.-]+)*$/.test(link) ? link : "";
}

export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  /** Cal.com event link, e.g. "theexperts/free-project-consultation". */
  calcomLink: normaliseCalLink(process.env.NEXT_PUBLIC_CALCOM_LINK),
};

export const uploadsEnabled = () => Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
