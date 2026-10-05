import "server-only";
import { env, isEmailConfigured, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdmin, UPLOAD_BUCKET } from "@/lib/supabase/server";
import {
  AREAS,
  BUDGETS,
  FILE_CATEGORIES,
  RENOVATION_TYPES,
  TIMELINES,
  WORK_TYPES,
  labelFor,
} from "@/features/estimate/options";
import type { NewLead, SavedLead } from "./leads";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Signed links to the uploaded files, valid for 7 days. */
async function fileLinks(lead: NewLead) {
  if (!lead.files.length || !isSupabaseConfigured()) return [];
  const { data } = await getSupabaseAdmin()
    .storage.from(UPLOAD_BUCKET)
    .createSignedUrls(
      lead.files.map((f) => f.path),
      60 * 60 * 24 * 7,
    );
  return lead.files.map((f, i) => ({ ...f, url: data?.[i]?.signedUrl ?? "" }));
}

/**
 * Emails the team about a new estimate request via Resend's HTTP API.
 * Never throws — a failed email must not lose the (already saved) lead.
 */
export async function notifyTeamOfLead(lead: NewLead, saved: SavedLead) {
  if (!isEmailConfigured()) {
    console.info(`[lead] ${saved.reference}: email alerts not configured (RESEND_API_KEY / LEAD_NOTIFICATION_EMAIL).`);
    return;
  }
  try {
    const workList =
      lead.renovationType === "other"
        ? lead.workTypeOther ?? ""
        : lead.workTypes
            .map((w) => labelFor(WORK_TYPES[lead.renovationType as keyof typeof WORK_TYPES] ?? [], w))
            .join(", ");
    const files = await fileLinks(lead);

    const rows: [string, string][] = [
      ["Reference", saved.reference],
      ["Name", lead.fullName],
      ["Phone", lead.phone],
      ["Email", lead.email],
      ["Renovating", labelFor(RENOVATION_TYPES, lead.renovationType)],
      ["Type of work", workList],
      ["Budget", labelFor(BUDGETS, lead.budget)],
      ["Area", labelFor(AREAS, lead.area)],
      ["Address", [lead.address, lead.postcode].filter(Boolean).join(", ")],
      ["Start", labelFor(TIMELINES, lead.timeline)],
    ];

    const html = `
      <h2 style="font-family:sans-serif;color:#0f2242">New estimate request — ${esc(saved.reference)}</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 12px 4px 0;color:#4a5568;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="font-family:sans-serif;color:#0f2242">Project details</h3>
      <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(lead.description)}</p>
      ${
        files.length
          ? `<h3 style="font-family:sans-serif;color:#0f2242">Uploaded files (links valid 7 days)</h3><ul style="font-family:sans-serif;font-size:14px">${files
              .map(
                (f) =>
                  `<li>${esc(labelFor(FILE_CATEGORIES, f.category))}: ${
                    f.url ? `<a href="${esc(f.url)}">${esc(f.name)}</a>` : esc(f.name)
                  }</li>`,
              )
              .join("")}</ul>`
          : ""
      }`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.emailFrom,
        to: env.leadNotificationEmail.split(",").map((s) => s.trim()),
        reply_to: lead.email,
        subject: `New estimate request ${saved.reference}: ${labelFor(RENOVATION_TYPES, lead.renovationType)} — ${lead.fullName}`,
        html,
      }),
    });
    if (!res.ok) console.error(`[lead] ${saved.reference}: email failed`, res.status, await res.text());
  } catch (err) {
    console.error(`[lead] ${saved.reference}: email failed`, err);
  }
}
