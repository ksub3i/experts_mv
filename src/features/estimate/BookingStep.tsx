"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CheckCircleIcon, PhoneIcon, CalendarCheckIcon } from "@phosphor-icons/react/ssr";
import { publicEnv } from "@/lib/public-env";

/**
 * Step 9 — shown immediately after the request is saved. Embeds the Cal.com
 * booking calendar (prefilled, and tagged with the request ID so the webhook
 * can link the booking back to the lead). Falls back to a phone call when no
 * Cal.com link is configured.
 */
export function BookingStep({
  reference,
  requestId,
  name,
  email,
  phone,
  headingRef,
}: {
  reference: string;
  requestId: string;
  name: string;
  email: string;
  phone: string;
  headingRef: React.Ref<HTMLHeadingElement>;
}) {
  const calLink = publicEnv.calcomLink;

  useEffect(() => {
    if (!calLink) return;
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: { light: { "cal-brand": "#0f2242" }, dark: { "cal-brand": "#0f2242" } },
      });
    })();
  }, [calLink]);

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

      <h3 className="display mt-10 flex items-center gap-3 text-[length:clamp(1.25rem,4cqi,1.75rem)] text-ink">
        <CalendarCheckIcon size={30} weight="light" className="shrink-0 text-accent" aria-hidden="true" />
        Choose a time for your free consultation <span aria-hidden="true">→</span>
      </h3>

      {calLink ? (
        <div className="mt-6 min-h-[640px] border border-line">
          <Cal
            calLink={calLink}
            style={{ width: "100%", height: "100%", overflow: "auto" }}
            config={{
              name,
              email,
              layout: "month_view",
              theme: "light",
              metadata: { quoteRequestId: requestId, reference },
            }}
          />
        </div>
      ) : (
        <div className="mt-6 border border-line p-6">
          <p className="leading-relaxed text-muted">
            Online booking is coming soon. Our team will call you to arrange a convenient time — or call us now to book
            straight away.
          </p>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="eyebrow mt-5 inline-flex min-h-12 items-center gap-2 bg-accent px-6 text-on-accent transition-colors hover:bg-accent-strong"
          >
            <PhoneIcon size={18} weight="bold" aria-hidden="true" />
            Call {phone}
          </a>
        </div>
      )}
    </div>
  );
}
