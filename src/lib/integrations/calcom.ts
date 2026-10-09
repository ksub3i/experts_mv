/**
 * Cal.com webhook logic — pure functions with no database or framework
 * imports, so the rules can be tested in isolation.
 *
 * Webhook body shape (Cal.com "default" payload template):
 *   { triggerEvent, createdAt, payload: { uid, startTime, endTime, location,
 *     attendees[], metadata: { quoteRequestId, reference, videoCallUrl }, … } }
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type BookingStatus = "scheduled" | "rescheduled" | "cancelled" | "completed" | "no_show";

/** Events we act on, and the status each one sets. */
export const EVENT_STATUS: Record<string, BookingStatus> = {
  BOOKING_CREATED: "scheduled",
  BOOKING_RESCHEDULED: "scheduled", // the NEW booking; the old one becomes "rescheduled"
  BOOKING_CANCELLED: "cancelled",
  BOOKING_REJECTED: "cancelled", // only used if "requires confirmation" is ever turned on
  MEETING_ENDED: "completed",
};

export const MAX_BODY_BYTES = 256 * 1024;

/** Constant-time check of Cal.com's `x-cal-signature-256` (hex HMAC-SHA256 of the raw body). */
export function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature || !/^[0-9a-f]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);

const str = (v: unknown, max = 500) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const isoDate = (v: unknown) => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : null);

export type ParsedEvent =
  | { kind: "ping" }
  | { kind: "ignored"; triggerEvent: string }
  | { kind: "invalid"; reason: string }
  | {
      kind: "booking";
      triggerEvent: string;
      status: BookingStatus;
      /** When Cal.com generated this event — used to ignore stale/late deliveries. */
      eventAt: string | null;
      uid: string;
      previousUid: string | null;
      startsAt: string | null;
      endsAt: string | null;
      timezone: string | null;
      location: string | null;
      attendeeName: string | null;
      attendeeEmail: string | null;
      quoteRequestId: string | null;
    };

/** Validates and normalises a webhook body. Never throws. */
export function parseEvent(body: unknown): ParsedEvent {
  if (!body || typeof body !== "object") return { kind: "invalid", reason: "Body is not a JSON object" };
  const b = body as Record<string, unknown>;
  const triggerEvent = str(b.triggerEvent, 60);
  if (!triggerEvent) return { kind: "invalid", reason: "Missing triggerEvent" };
  if (triggerEvent.toUpperCase() === "PING") return { kind: "ping" };

  const status = EVENT_STATUS[triggerEvent];
  if (!status) return { kind: "ignored", triggerEvent };

  const p = (b.payload && typeof b.payload === "object" ? b.payload : null) as Record<string, unknown> | null;
  if (!p) return { kind: "invalid", reason: "Missing payload" };
  const uid = str(p.uid, 200);
  if (!uid) return { kind: "invalid", reason: "Missing booking uid" };

  const meta = (p.metadata && typeof p.metadata === "object" ? p.metadata : {}) as Record<string, unknown>;
  const attendees = Array.isArray(p.attendees) ? (p.attendees as Record<string, unknown>[]) : [];
  const attendee = attendees[0] ?? {};
  const responses = (p.responses && typeof p.responses === "object" ? p.responses : {}) as Record<string, unknown>;
  const responseEmail = (responses.email as { value?: unknown } | undefined)?.value;

  const startsAt = isoDate(p.startTime);
  // A booking row needs a start time; only "ended" events may omit it (we then keep the stored one).
  if (!startsAt && status === "scheduled") return { kind: "invalid", reason: "Missing or invalid startTime" };

  return {
    kind: "booking",
    triggerEvent,
    status,
    eventAt: isoDate(b.createdAt),
    uid,
    previousUid: str(p.rescheduleUid, 200) ?? str(p.fromReschedule, 200),
    startsAt,
    endsAt: isoDate(p.endTime),
    timezone: str(attendee.timeZone, 100),
    // Prefer the actual Google Meet URL over the generic "integrations:google:meet" location code.
    location: str(meta.videoCallUrl, 500) ?? str(p.location, 500),
    attendeeName: str(attendee.name, 200),
    attendeeEmail: str(attendee.email, 320) ?? str(responseEmail, 320),
    quoteRequestId: isUuid(meta.quoteRequestId) ? meta.quoteRequestId : null,
  };
}

/** What we already have stored for this booking uid (if anything). */
export type StoredBooking = { status: BookingStatus; eventAt: string | null };

/**
 * Decides whether an incoming event should change a stored booking.
 *  - Duplicate or older deliveries (by Cal.com's event time) are ignored.
 *  - Final states win: a late "created" can't undo a cancellation,
 *    completion or reschedule; "ended" doesn't resurrect a cancelled booking.
 */
export function decide(
  existing: StoredBooking | null,
  incoming: { status: BookingStatus; eventAt: string | null },
): { apply: boolean; status: BookingStatus; reason: string } {
  if (!existing) return { apply: true, status: incoming.status, reason: "new booking" };

  if (existing.eventAt && incoming.eventAt && Date.parse(incoming.eventAt) <= Date.parse(existing.eventAt)) {
    return { apply: false, status: existing.status, reason: "duplicate or out-of-order event" };
  }

  const final: BookingStatus[] = ["cancelled", "completed", "rescheduled", "no_show"];
  if (incoming.status === "scheduled" && final.includes(existing.status)) {
    return { apply: false, status: existing.status, reason: `late event; booking already ${existing.status}` };
  }
  if (incoming.status === "completed" && existing.status === "cancelled") {
    return { apply: false, status: existing.status, reason: "meeting ended for a cancelled booking" };
  }
  return { apply: true, status: incoming.status, reason: "update" };
}
