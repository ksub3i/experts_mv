"use client";

import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import {
  CheckCircleIcon,
  PhoneIcon,
  CalendarCheckIcon,
  VideoCameraIcon,
  ArrowSquareOutIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react/ssr";
import { publicEnv } from "@/lib/public-env";
import { buttonClasses } from "@/components/ui/Button";

const NAMESPACE = "consultation";
const LOAD_TIMEOUT_MS = 20_000;

type Booked = { uid?: string; startTime?: string; endTime?: string };
type Mode = "booking" | "booked" | "skipped";

/** Cal.com's phone field expects international format; Maldives numbers are 7 digits. */
function toE164(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (/^\+\d{7,15}$/.test(digits)) return digits;
  if (/^\d{7}$/.test(digits)) return `+960${digits}`;
  if (/^960\d{7}$/.test(digits)) return `+${digits}`;
  return ""; // unknown format — let the customer type it in Cal.com
}

/**
 * Step 9 — shown only after the estimate request is saved, so nothing here can
 * affect the saved request. Embeds the Cal.com booking calendar inline, prefilled
 * with the customer's details and tagged (hidden) with the request ID/reference
 * so the webhook can link the booking to the request.
 */
export function BookingStep({
  reference,
  requestId,
  name,
  email,
  customerPhone,
  sitePhone,
  headingRef,
}: {
  reference: string;
  requestId: string;
  name: string;
  email: string;
  customerPhone: string;
  sitePhone: string;
  headingRef: React.Ref<HTMLHeadingElement>;
}) {
  const calLink = publicEnv.calcomLink;
  const [mode, setMode] = useState<Mode>("booking");
  const [booked, setBooked] = useState<Booked | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const phone = toE164(customerPhone);
  const prefill: Record<string, string> = { name, email, ...(phone ? { attendeePhoneNumber: phone } : {}) };

  // Cal.com embed: brand styling + booking events (registered once per visit to the booking view).
  useEffect(() => {
    if (!calLink || mode !== "booking") return;
    let cancelled = false;
    let readyFired = false;
    let unregister: (() => void) | undefined;
    // If the calendar hasn't loaded in time (blocked script, network), show the fallback.
    const timer = setTimeout(() => !cancelled && !readyFired && setFailed(true), LOAD_TIMEOUT_MS);

    getCalApi({ namespace: NAMESPACE })
      .then((cal) => {
        if (cancelled) return;
        cal("ui", {
          theme: "light",
          layout: "month_view",
          hideEventTypeDetails: false,
          cssVarsPerTheme: { light: { "cal-brand": "#0f2242" }, dark: { "cal-brand": "#0f2242" } },
        });
        const onReady = () => {
          readyFired = true;
          if (!cancelled) setLoaded(true);
        };
        const onFailed = () => !cancelled && setFailed(true);
        const onBooked = (e: { detail: { data: Booked } }) => {
          if (cancelled) return;
          setBooked(e.detail.data);
          setMode("booked");
        };
        const handlers = [
          { action: "linkReady", callback: onReady },
          { action: "linkFailed", callback: onFailed },
          { action: "bookingSuccessfulV2", callback: onBooked },
          { action: "rescheduleBookingSuccessfulV2", callback: onBooked },
        ] as const;
        handlers.forEach((h) => cal("on", h as never));
        unregister = () => handlers.forEach((h) => cal("off", h as never));
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      unregister?.();
    };
  }, [calLink, mode]);

  // Move focus to the new result for keyboard and screen-reader users.
  useEffect(() => {
    if (mode !== "booking") resultRef.current?.focus();
  }, [mode]);

  const directLink = calLink
    ? `https://cal.com/${calLink}?${new URLSearchParams({
        ...prefill,
        "metadata[quoteRequestId]": requestId,
        "metadata[reference]": reference,
      })}`
    : "";
  const tel = `tel:${sitePhone.replace(/[^\d+]/g, "")}`;

  return (
    <div>
      <div role="status" className="flex items-start gap-4 border-l-4 border-success bg-surface p-5 sm:p-6">
        <CheckCircleIcon size={36} weight="fill" className="shrink-0 text-success" aria-hidden="true" />
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-ink outline-none">
            Thanks! Your project request has been received.
          </h2>
          <p className="mt-1 text-sm text-muted">
            Your reference is <strong className="text-ink">{reference}</strong>. Our team will review your details
            before your consultation.
          </p>
        </div>
      </div>

      {mode === "booked" && <BookedCard booked={booked} reference={reference} headingRef={resultRef} />}

      {mode === "skipped" && (
        <div className="mt-10 border border-line p-6 sm:p-8">
          <h3 ref={resultRef} tabIndex={-1} className="display text-2xl text-ink outline-none">
            Request complete
          </h3>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            You&apos;re all set — no need to book now. Our team will contact you to arrange your free consultation.
            Quote reference <strong className="text-ink">{reference}</strong>.
          </p>
          {calLink && (
            <button type="button" onClick={() => setMode("booking")} className={buttonClasses("outline-dark", "mt-6")}>
              <CalendarCheckIcon size={18} aria-hidden="true" /> Book a time now instead
            </button>
          )}
        </div>
      )}

      {mode === "booking" && (
        <>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <h3 className="display flex items-center gap-3 text-[length:clamp(1.25rem,4cqi,1.75rem)] text-ink">
              <CalendarCheckIcon size={30} weight="light" className="shrink-0 text-accent" aria-hidden="true" />
              Choose a time for your free consultation
            </h3>
            <button
              type="button"
              onClick={() => setMode("skipped")}
              className="eyebrow min-h-11 cursor-pointer text-muted underline underline-offset-4 hover:text-ink"
            >
              Skip — I&apos;ll book later
            </button>
          </div>
          <p className="mt-3 text-sm text-muted">
            A free 30-minute Google Meet call. Pick a date and time below — your details are already filled in.
          </p>

          {calLink && !failed && (
            <div className="relative mt-6 min-h-[560px] overflow-hidden border border-line bg-paper">
              {!loaded && (
                <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
                </div>
              )}
              <Cal
                namespace={NAMESPACE}
                calLink={calLink}
                style={{ width: "100%", height: "100%", minHeight: 560, overflow: "auto" }}
                config={{
                  ...prefill,
                  layout: "month_view",
                  theme: "light",
                  // Hidden booking context, read by /api/webhooks/calcom. Flat keys: the embed
                  // turns them into ?metadata[quoteRequestId]=… (nested objects are not serialised).
                  "metadata[quoteRequestId]": requestId,
                  "metadata[reference]": reference,
                }}
              />
            </div>
          )}

          {(!calLink || failed) && (
            <div className="mt-6 border border-line p-6">
              <p className="leading-relaxed text-muted">
                {calLink
                  ? "The booking calendar couldn't load here. You can open it in a new tab, or call us and we'll book a time for you."
                  : "Online booking is coming soon. Our team will call you to arrange a convenient time — or call us now to book straight away."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {directLink && (
                  <a href={directLink} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary")}>
                    Open booking page <ArrowSquareOutIcon size={16} weight="bold" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                <a href={tel} className={buttonClasses(directLink ? "outline-dark" : "primary")}>
                  <PhoneIcon size={18} weight="bold" aria-hidden="true" /> Call {sitePhone}
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BookedCard({
  booked,
  reference,
  headingRef,
}: {
  booked: Booked | null;
  reference: string;
  headingRef: React.Ref<HTMLHeadingElement>;
}) {
  const start = booked?.startTime ? new Date(booked.startTime) : null;
  const end = booked?.endTime ? new Date(booked.endTime) : null;
  const valid = start && !Number.isNaN(start.getTime());
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzShort =
    valid &&
    new Intl.DateTimeFormat("en-GB", { timeZoneName: "short" }).formatToParts(start!).find((p) => p.type === "timeZoneName")
      ?.value;
  const tzLabel = tz === "Indian/Maldives" ? `Maldives time (${tzShort ?? "GMT+5"})` : `${tz.replace(/_/g, " ")}${tzShort ? ` (${tzShort})` : ""}`;
  const time = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });

  const rows: [string, string][] = valid
    ? [
        ["Date", start!.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
        ["Time", end && !Number.isNaN(end.getTime()) ? `${time(start!)} – ${time(end)}` : time(start!)],
        ["Timezone", tzLabel],
        ["Quote reference", reference],
      ]
    : [["Quote reference", reference]];

  return (
    <div className="@container on-dark relative mt-10 overflow-hidden bg-ink p-6 text-paper sm:p-8">
      <p className="eyebrow flex items-center gap-2 text-highlight">
        <CheckCircleIcon size={18} weight="fill" aria-hidden="true" /> Confirmed
      </p>
      <h3 ref={headingRef} tabIndex={-1} className="display mt-3 text-[length:clamp(1rem,8cqi,2.5rem)] outline-none">
        Consultation booked
      </h3>

      <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="eyebrow text-muted-inverse">{k}</dt>
            <dd className="mt-1 text-lg font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex items-start gap-3 border-t border-line-inverse pt-6 text-muted-inverse">
        <VideoCameraIcon size={22} className="mt-0.5 shrink-0 text-highlight" aria-hidden="true" />
        <p>
          <strong className="text-paper">Google Meet</strong> — your meeting link is in the confirmation email from
          Cal.com and in the calendar invite.
        </p>
      </div>

      <h4 className="eyebrow mt-8 text-paper">What happens next</h4>
      <ul className="mt-3 space-y-2 text-muted-inverse">
        <li className="flex gap-3">
          <EnvelopeSimpleIcon size={20} className="mt-0.5 shrink-0 text-highlight" aria-hidden="true" />
          Check your email for the confirmation, the Meet link and a reminder before the call. You can reschedule or
          cancel from that email.
        </li>
        <li className="flex gap-3">
          <CheckCircleIcon size={20} className="mt-0.5 shrink-0 text-highlight" aria-hidden="true" />
          We&apos;ll review your answers and photos before the call, so we can talk specifics.
        </li>
        <li className="flex gap-3">
          <CalendarCheckIcon size={20} className="mt-0.5 shrink-0 text-highlight" aria-hidden="true" />
          After the consultation, you&apos;ll receive a clear written estimate.
        </li>
      </ul>
    </div>
  );
}
