import { createHmac, timingSafeEqual } from "node:crypto";
import { env, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * POST /api/webhooks/calcom
 * Receives Cal.com booking events and records them in consultation_bookings.
 * The estimate page passes `metadata[quoteRequestId]` into the Cal.com embed,
 * so bookings are linked back to the request that created them.
 *
 * Cal.com setup: Settings → Developer → Webhooks → add this URL with the
 * same secret as CALCOM_WEBHOOK_SECRET, events: Booking created / rescheduled /
 * cancelled / meeting ended.
 */

type CalPayload = {
  uid: string;
  rescheduleUid?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  attendees?: { name?: string; email?: string; timeZone?: string }[];
  metadata?: { quoteRequestId?: string };
  responses?: { email?: { value?: string } };
};

const STATUS: Record<string, "scheduled" | "rescheduled" | "cancelled" | "completed"> = {
  BOOKING_CREATED: "scheduled",
  BOOKING_RESCHEDULED: "scheduled",
  BOOKING_CANCELLED: "cancelled",
  MEETING_ENDED: "completed",
};

function validSignature(raw: string, signature: string | null) {
  if (!env.calcomWebhookSecret || !signature) return false;
  const expected = createHmac("sha256", env.calcomWebhookSecret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

const isUuid = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export async function POST(request: Request) {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-cal-signature-256"))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) return Response.json({ error: "Database not configured" }, { status: 503 });

  const event = JSON.parse(raw) as { triggerEvent: string; payload: CalPayload };
  const status = STATUS[event.triggerEvent];
  if (!status || !event.payload?.uid) return Response.json({ ok: true, ignored: event.triggerEvent });

  const p = event.payload;
  const attendee = p.attendees?.[0];
  const db = getSupabaseAdmin();
  const quoteRequestId = isUuid(p.metadata?.quoteRequestId) ? p.metadata!.quoteRequestId! : null;

  let customerId: string | null = null;
  if (quoteRequestId) {
    const { data } = await db.from("quote_requests").select("customer_id").eq("id", quoteRequestId).maybeSingle();
    customerId = data?.customer_id ?? null;
  }

  const { error } = await db.from("consultation_bookings").upsert(
    {
      provider: "calcom",
      external_id: p.uid,
      quote_request_id: quoteRequestId,
      customer_id: customerId,
      status,
      starts_at: p.startTime,
      ends_at: p.endTime ?? null,
      timezone: attendee?.timeZone ?? null,
      location: p.location ?? null,
      attendee_name: attendee?.name ?? null,
      attendee_email: attendee?.email ?? p.responses?.email?.value ?? null,
      raw_payload: event,
    },
    { onConflict: "provider,external_id" },
  );
  if (error) {
    console.error("[calcom] booking upsert failed", error);
    return Response.json({ error: "Could not save booking" }, { status: 500 });
  }

  // A reschedule creates a new booking uid; mark the original as rescheduled.
  if (event.triggerEvent === "BOOKING_RESCHEDULED" && p.rescheduleUid) {
    await db
      .from("consultation_bookings")
      .update({ status: "rescheduled" })
      .eq("provider", "calcom")
      .eq("external_id", p.rescheduleUid);
  }

  // Move the lead forward when a consultation is booked (never backwards).
  if (quoteRequestId && status === "scheduled") {
    await db
      .from("quote_requests")
      .update({ status: "consultation_booked" })
      .eq("id", quoteRequestId)
      .in("status", ["new", "contacted"]);
  }

  return Response.json({ ok: true });
}
