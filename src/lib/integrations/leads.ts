import type { QuoteRequest } from "@/features/quote/schema";

/**
 * Lead handling is behind an interface so a CRM (HubSpot, Jobber, etc.),
 * email notifications or a calendar booking service can be plugged in later
 * by adding an adapter here — the form and API route do not change.
 */
export type Lead = Omit<QuoteRequest, "website"> & { source: string; receivedAt: string };

export interface LeadService {
  submit(lead: Lead): Promise<{ id: string }>;
}

/** Development adapter: logs the lead to the server console. */
const consoleLeadService: LeadService = {
  async submit(lead) {
    const id = crypto.randomUUID();
    console.info("[lead] received", { id, ...lead });
    return { id };
  },
};

export function getLeadService(): LeadService {
  // e.g. if (process.env.CRM_PROVIDER === "hubspot") return hubspotLeadService;
  return consoleLeadService;
}
