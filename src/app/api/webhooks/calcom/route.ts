import { env, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MAX_BODY_BYTES, decide, parseEvent, verifySignature, type BookingStatus } from "@/lib/integrations/calcom";

/**
 * POST /api/webhooks/calcom
 * Records Cal.com booking events in consultation_bookings (no schema changes).
 *
 * The estimate page passes `metadata.quoteRequestId` into the Cal.com embed,
 * so bookings link back to the request that created them.
 *
 * Responses: 2xx when an event is handled or deliberately ignored (so Cal.com
 * doesn't retry), 401 for bad signatures, 400/413 for malformed requests, and
 * 5xx only for real server/database problems (so Cal.com retries those).
 *
 * Cal.com setup: Settings → Developer → Webhooks → this URL, the same secret as
 * CALCOM_WEBHOOK_SECRET, events: booking created / rescheduled / cancelled,
 * meeting ended.
 */
export async function POST(request: Request) {
  if (!env.calcomWebhookSecret) {
    console.error("[calcom] CALCOM_WEBHOOK_SECRET is not set — rejecting webhook.");
    return Response.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return Response.json({ error: "Payload too large" }, { status: 413 });
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return Response.json({ error: "Payload too large" }, { status: 413 });

  if (!verifySignature(raw, request.headers.get("x-cal-signature-256"), env.calcomWebhookSecret)) {
    console.warn("[calcom] rejected webhook with a missing or invalid signature");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const event = parseEvent(body);
  if (event.kind === "ping") return Response.json({ ok: true, ping: true });
  if (event.kind === "ignored") return Response.json({ ok: true, ignored: event.triggerEvent });
  if (event.kind === "invalid") {
    console.warn(`[calcom] invalid webhook payload: ${event.reason}`);
    return Response.json({ error: event.reason }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    console.error("[calcom] Supabase is not configured — booking not recorded.");
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }
  const db = getSupabaseAdmin();

  // Current state of this booking, and of the booking it replaces (reschedules).
  const uids = [event.uid, event.previousUid].filter((u): u is string => Boolean(u));
  const { data: rows, error: readError } = await db
    .from("consultation_bookings")
    .select("external_id, status, quote_request_id, customer_id, starts_at, raw_payload")
    .eq("provider", "calcom")
    .in("external_id", uids);
  if (readError) {
    console.error("[calcom] could not read bookings", readError.message);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
  const current = rows?.find((r) => r.external_id === event.uid) ?? null;
  const previous = event.previousUid ? (rows?.find((r) => r.external_id === event.previousUid) ?? null) : null;

  const decision = decide(
    current && { status: current.status as BookingStatus, eventAt: (current.raw_payload as { createdAt?: string })?.createdAt ?? null },
    { status: event.status, eventAt: event.eventAt },
  );
  if (!decision.apply) {
    console.info(`[calcom] ${event.triggerEvent} ${event.uid}: skipped (${decision.reason})`);
    return Response.json({ ok: true, skipped: decision.reason });
  }

  // Link to the quote request: from this booking's metadata, else from the booking it reschedules.
  let quoteRequestId = event.quoteRequestId ?? current?.quote_request_id ?? previous?.quote_request_id ?? null;
  let customerId: string | null = current?.customer_id ?? previous?.customer_id ?? null;
  if (quoteRequestId) {
    const { data: qr } = await db.from("quote_requests").select("id, customer_id").eq("id", quoteRequestId).maybeSingle();
    if (qr) {
      customerId = qr.customer_id;
    } else {
      // Unknown request (e.g. deleted test data): keep the booking, just unlinked.
      console.warn(`[calcom] ${event.uid}: quote request ${quoteRequestId} not found — storing booking unlinked`);
      quoteRequestId = null;
    }
  }

  const startsAt = event.startsAt ?? current?.starts_at ?? null;
  if (!startsAt) {
    console.warn(`[calcom] ${event.triggerEvent} ${event.uid}: no start time and no stored booking — ignored`);
    return Response.json({ ok: true, skipped: "no start time" });
  }

  const { error: writeError } = await db.from("consultation_bookings").upsert(
    {
      provider: "calcom",
      external_id: event.uid,
      quote_request_id: quoteRequestId,
      customer_id: customerId,
      status: decision.status,
      starts_at: startsAt,
      ends_at: event.endsAt,
      timezone: event.timezone,
      location: event.location,
      attendee_name: event.attendeeName,
      attendee_email: event.attendeeEmail,
      raw_payload: body,
    },
    { onConflict: "provider,external_id" },
  );
  if (writeError) {
    console.error(`[calcom] ${event.uid}: could not save booking`, writeError.message);
    return Response.json({ error: "Could not save booking" }, { status: 500 });
  }

  // A reschedule creates a new booking; mark the original as rescheduled.
  if (event.triggerEvent === "BOOKING_RESCHEDULED" && event.previousUid && previous) {
    await db
      .from("consultation_bookings")
      .update({ status: "rescheduled" })
      .eq("provider", "calcom")
      .eq("external_id", event.previousUid)
      .eq("status", "scheduled");
  }

  // Move the lead forward when a consultation is booked (never backwards).
  if (quoteRequestId && decision.status === "scheduled") {
    await db
      .from("quote_requests")
      .update({ status: "consultation_booked" })
      .eq("id", quoteRequestId)
      .in("status", ["new", "contacted"]);
  }

  console.info(`[calcom] ${event.triggerEvent} ${event.uid}: saved as ${decision.status}${quoteRequestId ? ` (request ${quoteRequestId})` : ""}`);
  return Response.json({ ok: true, status: decision.status });
}
