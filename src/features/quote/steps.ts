import type { QuoteInput } from "./schema";

export type QuoteField = {
  name: Exclude<keyof QuoteInput, "website">;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  /** Spans both columns on wide screens. */
  wide?: boolean;
};

export type QuoteStep = {
  id: string;
  title: string;
  fields: QuoteField[];
};

/**
 * Questionnaire configuration. Today it is a single step; add more objects
 * (e.g. "Project type", "Budget & timeline", "Photos", "Book a visit") and the
 * form automatically shows a progress indicator with Back / Continue buttons.
 */
export const quoteSteps: QuoteStep[] = [
  {
    id: "contact",
    title: "Your details",
    fields: [
      { name: "fullName", label: "Full name", autoComplete: "name", required: true },
      { name: "email", label: "Email address", type: "email", autoComplete: "email", required: true },
      { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", required: true },
      { name: "location", label: "Project location (city/town)", autoComplete: "address-level2", required: true },
      {
        name: "details",
        label: "How can we help?",
        type: "textarea",
        hint: "Tell us about your project — the more detail, the more accurate your quote.",
        wide: true,
      },
    ],
  },
];
