"use client";

import dynamic from "next/dynamic";

/**
 * Loads the questionnaire in the browser only, so a saved draft (sessionStorage)
 * can be restored on first render without a server/client mismatch.
 */
const EstimateWizard = dynamic(() => import("./EstimateWizard").then((m) => m.EstimateWizard), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" aria-label="Loading questionnaire" className="space-y-4">
      <div className="h-3 w-24 animate-pulse bg-line" />
      <div className="h-1.5 w-full bg-line" />
      <div className="mt-8 h-10 w-3/4 animate-pulse bg-line" />
      <div className="grid gap-3 pt-6 sm:grid-cols-2">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-14 animate-pulse bg-surface" />
        ))}
      </div>
    </div>
  ),
});

export function EstimateLoader({ phone }: { phone: string }) {
  return <EstimateWizard phone={phone} />;
}
