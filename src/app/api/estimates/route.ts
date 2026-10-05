import { after } from "next/server";
import { z } from "zod";
import { estimateSchema, type UploadedFile } from "@/features/estimate/schema";
import { getLeadService } from "@/lib/integrations/leads";
import { notifyTeamOfLead } from "@/lib/integrations/notifications";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdmin, UPLOAD_BUCKET } from "@/lib/supabase/server";

/**
 * Confirms each claimed file was really uploaded to this request's own
 * upload folder, and takes size/type from Storage rather than the browser.
 */
async function verifyFiles(sessionId: string, files: UploadedFile[]): Promise<UploadedFile[] | null> {
  if (!files.length) return [];
  if (!isSupabaseConfigured()) return null;
  const prefix = `requests/${sessionId}`;
  if (files.some((f) => !f.path.startsWith(`${prefix}/`))) return null;

  const { data, error } = await getSupabaseAdmin().storage.from(UPLOAD_BUCKET).list(prefix, { limit: 100 });
  if (error || !data) return null;
  const stored = new Map(data.map((o) => [`${prefix}/${o.name}`, o.metadata as { size?: number; mimetype?: string }]));

  const verified: UploadedFile[] = [];
  for (const f of files) {
    const meta = stored.get(f.path);
    if (!meta) return null;
    verified.push({ ...f, size: meta.size ?? f.size, contentType: meta.mimetype ?? f.contentType });
  }
  return verified;
}

/** POST /api/estimates — saves a completed estimate questionnaire. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = estimateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check your answers.", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const { website, uploadSessionId, ...answers } = parsed.data;
  // Honeypot filled → pretend success, store nothing.
  if (website) return Response.json({ id: crypto.randomUUID(), reference: "EXP-0000" }, { status: 201 });

  const files = await verifyFiles(uploadSessionId, answers.files);
  if (files === null) {
    return Response.json({ error: "Some uploaded files couldn't be found. Please re-upload them." }, { status: 422 });
  }

  const url = new URL(request.headers.get("referer") ?? "http://x/");
  const utm = Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      .map((k) => [k, url.searchParams.get(k)])
      .filter((e): e is [string, string] => Boolean(e[1])),
  );

  const lead = { ...answers, files, source: "website-estimate", utm };

  try {
    const saved = await getLeadService().submit(lead);
    // Email the team after responding, so the customer isn't kept waiting.
    after(() => notifyTeamOfLead(lead, saved));
    return Response.json(saved, { status: 201 });
  } catch (err) {
    console.error("[estimate] submit failed", err);
    return Response.json(
      { error: "We couldn't send your request just now. Please try again, or call us." },
      { status: 502 },
    );
  }
}
