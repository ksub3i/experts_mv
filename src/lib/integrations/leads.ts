import "server-only";
import type { EstimateRequest } from "@/features/estimate/schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Lead storage is behind an interface so other destinations (a CRM, a
 * spreadsheet…) can be added as adapters without touching the form or API.
 */
export type NewLead = Omit<EstimateRequest, "website" | "uploadSessionId"> & {
  source: string;
  utm?: Record<string, string>;
};

export type SavedLead = { id: string; reference: string };

export interface LeadService {
  readonly name: string;
  submit(lead: NewLead): Promise<SavedLead>;
}

/** Production adapter: one atomic call to submit_quote_request() in Postgres. */
const supabaseLeadService: LeadService = {
  name: "supabase",
  async submit(lead) {
    const { data, error } = await getSupabaseAdmin().rpc("submit_quote_request", { payload: lead });
    if (error) throw new Error(`submit_quote_request failed: ${error.message}`);
    const row = (Array.isArray(data) ? data[0] : data) as { request_id: string; request_reference: string };
    return { id: row.request_id, reference: row.request_reference };
  },
};

/** Local development fallback when Supabase isn't configured: logs only. */
const consoleLeadService: LeadService = {
  name: "console",
  async submit(lead) {
    const id = crypto.randomUUID();
    const reference = `DEV-${id.slice(0, 8).toUpperCase()}`;
    console.info("[lead] Supabase not configured — logging instead of saving", { id, reference, ...lead });
    return { id, reference };
  },
};

export function getLeadService(): LeadService {
  if (isSupabaseConfigured()) return supabaseLeadService;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Lead storage is not configured (Supabase env vars missing).");
  }
  return consoleLeadService;
}
