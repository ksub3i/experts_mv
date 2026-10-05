/**
 * Browser-safe settings. Only NEXT_PUBLIC_* values (inlined at build time) may
 * appear here — this file is imported by client components.
 */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  /** Cal.com event link, e.g. "theexperts/consultation". Empty → phone fallback. */
  calcomLink: process.env.NEXT_PUBLIC_CALCOM_LINK ?? "",
};

export const uploadsEnabled = () => Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
