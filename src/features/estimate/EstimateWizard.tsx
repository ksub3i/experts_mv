"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
  CookingPotIcon,
  BathtubIcon,
  HouseLineIcon,
  PaintRollerIcon,
  WrenchIcon,
  StorefrontIcon,
  CraneIcon,
  DotsThreeIcon,
} from "@phosphor-icons/react/ssr";
import type { IconProps } from "@phosphor-icons/react";
import { AREAS, BUDGETS, RENOVATION_TYPES, TIMELINES, WORK_TYPES, labelFor, type RenovationType } from "./options";
import { stepSchemas, type UploadedFile } from "./schema";
import { ChoiceCards, CheckCards, TextField } from "./fields";
import { FileUploads } from "./FileUploads";
import { BookingStep } from "./BookingStep";
import { buttonClasses } from "@/components/ui/Button";
import { cx } from "@/lib/utils";

const ICONS: Record<RenovationType, React.ComponentType<IconProps>> = {
  kitchen: CookingPotIcon,
  bathroom: BathtubIcon,
  full_home: HouseLineIcon,
  exterior: PaintRollerIcon,
  repairs: WrenchIcon,
  commercial: StorefrontIcon,
  new_construction: CraneIcon,
  other: DotsThreeIcon,
};

type Draft = {
  renovationType?: string;
  workTypes: string[];
  workTypeOther: string;
  budget?: string;
  area?: string;
  address: string;
  postcode: string;
  timeline?: string;
  description: string;
  files: UploadedFile[];
  fullName: string;
  phone: string;
  email: string;
  website: string;
  uploadSessionId: string;
};

type Errors = Partial<Record<string, string>>;

const STORAGE_KEY = "experts-estimate-draft-v1";

const STEPS = [
  { title: "What are you looking to renovate?", fields: ["renovationType"] },
  { title: "What type of work?", fields: ["workTypes", "workTypeOther"] },
  { title: "What's your approximate budget?", fields: ["budget"] },
  { title: "Where is the property?", fields: ["area", "address", "postcode"] },
  { title: "When are you looking to start?", fields: ["timeline"] },
  { title: "Tell us about the project", fields: ["description"] },
  { title: "Upload photos", fields: ["files"] },
  { title: "Your contact information", fields: ["fullName", "phone", "email"] },
] as const;

const QUESTION_COUNT = STEPS.length; // Step 9 (booking) follows submission.

function emptyDraft(): Draft {
  return {
    workTypes: [],
    workTypeOther: "",
    address: "",
    postcode: "",
    description: "",
    files: [],
    fullName: "",
    phone: "",
    email: "",
    website: "",
    uploadSessionId: crypto.randomUUID(),
  };
}

/** Restore an unfinished questionnaire after a refresh (per browser tab). */
function loadSaved(): { draft: Draft; step: number } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { draft: Draft; step: number };
      if (saved?.draft?.uploadSessionId) {
        return { draft: { ...emptyDraft(), ...saved.draft }, step: Math.min(saved.step ?? 0, QUESTION_COUNT - 1) };
      }
    }
  } catch {
    /* storage unavailable — start fresh */
  }
  return { draft: emptyDraft(), step: 0 };
}

export function EstimateWizard({ phone }: { phone: string }) {
  const [initial] = useState(loadSaved);
  const [draft, setDraft] = useState<Draft>(initial.draft);
  const [step, setStep] = useState(initial.step);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ id: string; reference: string } | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Persist progress (until submitted).
  useEffect(() => {
    if (result) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, step }));
    } catch {
      /* ignore */
    }
  }, [draft, step, result]);

  // On step change: bring the questionnaire into view and focus the new question.
  useEffect(() => {
    if (!moved.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, result]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const setFiles = useCallback((files: UploadedFile[]) => setDraft((d) => ({ ...d, files })), []);

  const validate = (index: number) => {
    const res = stepSchemas[index].safeParse(draft);
    if (res.success) return true;
    const next: Errors = {};
    for (const issue of res.error.issues) {
      const key = String(issue.path[0] ?? "");
      next[key] ??= issue.message;
    }
    setErrors(next);
    // Focus the first invalid control once the error has rendered.
    setTimeout(() => {
      const first = STEPS[index].fields.find((f) => next[f]);
      (document.getElementById(`field-${first}`) ?? document.querySelector<HTMLElement>(`input[name="${first}"]`))?.focus();
    }, 0);
    return false;
  };

  const go = (to: number) => {
    moved.current = true;
    setServerError("");
    setStep(to);
  };

  async function submit() {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Send the customer back to the first step with a problem.
        const issues = (body.issues ?? {}) as Record<string, string[]>;
        const badStep = STEPS.findIndex((s) => s.fields.some((f) => issues[f]?.length));
        if (badStep >= 0) {
          setErrors(Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v[0]])));
          go(badStep);
        }
        throw new Error(body.error ?? "Something went wrong.");
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      moved.current = true;
      setResult(body);
    } catch (err) {
      setServerError(
        `${err instanceof Error ? err.message : "Something went wrong."} If it keeps happening, call us on ${phone}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  const onNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading || submitting || !validate(step)) return;
    if (step < QUESTION_COUNT - 1) go(step + 1);
    else submit();
  };

  // ---- Step 9: booking ----------------------------------------------------
  if (result) {
    return (
      <div ref={topRef} data-step="booking" className="scroll-mt-28">
        <Progress current={QUESTION_COUNT + 1} label="Book your consultation" />
        <BookingStep
          reference={result.reference}
          requestId={result.id}
          name={draft.fullName}
          email={draft.email}
          customerPhone={draft.phone}
          sitePhone={phone}
          headingRef={headingRef}
        />
      </div>
    );
  }

  const type = draft.renovationType as RenovationType | undefined;
  const current = STEPS[step];
  const isLast = step === QUESTION_COUNT - 1;

  return (
    <div ref={topRef} className="scroll-mt-28">
      <Progress current={step + 1} label={current.title} />

      <form onSubmit={onNext} noValidate aria-labelledby="estimate-step-title">
        <h2
          id="estimate-step-title"
          ref={headingRef}
          tabIndex={-1}
          className="display text-[length:clamp(1.5rem,5cqi,2.5rem)] text-ink outline-none"
        >
          {current.title}
        </h2>
        {step === 1 && type && type !== "other" && (
          <p className="mt-2 text-muted">For your {labelFor(RENOVATION_TYPES, type).toLowerCase()} project.</p>
        )}
        {step === 2 && <p className="mt-2 text-muted">In Maldivian Rufiyaa (MVR). A rough range is fine.</p>}
        {step === 5 && (
          <p className="mt-2 text-muted">What you&apos;d like done, the size of the space, and anything we should know.</p>
        )}

        <div className="mt-8">
          {step === 0 && (
            <ChoiceCards
              name="renovationType"
              legend={current.title}
              value={draft.renovationType}
              error={errors.renovationType}
              options={RENOVATION_TYPES.map((o) => ({ ...o, icon: ICONS[o.value] }))}
              onChange={(v) => {
                setDraft((d) => ({ ...d, renovationType: v, workTypes: v === d.renovationType ? d.workTypes : [] }));
                setErrors({});
              }}
            />
          )}

          {step === 1 &&
            (type === "other" || !type ? (
              <TextField
                id="field-workTypeOther"
                label="Type of work"
                required
                value={draft.workTypeOther}
                onChange={(v) => set("workTypeOther", v)}
                error={errors.workTypeOther}
                hint="For example: build a partition wall, fit new doors, repair a ceiling."
                maxLength={300}
              />
            ) : (
              <CheckCards
                name="workTypes"
                legend={current.title}
                options={WORK_TYPES[type as keyof typeof WORK_TYPES]}
                values={draft.workTypes}
                onChange={(v) => set("workTypes", v)}
                error={errors.workTypes}
              />
            ))}

          {step === 2 && (
            <ChoiceCards
              name="budget"
              legend={current.title}
              options={BUDGETS}
              value={draft.budget}
              onChange={(v) => set("budget", v)}
              error={errors.budget}
            />
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <p className="eyebrow mb-3 text-ink">
                  Area<span aria-hidden="true" className="ml-1 text-danger">*</span>
                </p>
                <ChoiceCards
                  name="area"
                  legend="Area"
                  options={AREAS}
                  value={draft.area}
                  onChange={(v) => set("area", v)}
                  error={errors.area}
                />
                {draft.area === "other" && (
                  <p className="mt-3 text-sm text-muted">
                    We mainly work in Malé and Hulhumalé, but tell us where you are and we&apos;ll see what we can do.
                  </p>
                )}
              </div>
              <TextField
                id="field-address"
                label="Address"
                required
                value={draft.address}
                onChange={(v) => set("address", v)}
                error={errors.address}
                hint="Building or house name, road, and island if outside Malé/Hulhumalé."
                autoComplete="street-address"
                maxLength={300}
              />
              <TextField
                id="field-postcode"
                label="Postcode"
                value={draft.postcode}
                onChange={(v) => set("postcode", v)}
                error={errors.postcode}
                hint="5 digits, e.g. 20014."
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={5}
              />
            </div>
          )}

          {step === 4 && (
            <ChoiceCards
              name="timeline"
              legend={current.title}
              columns={1}
              options={TIMELINES}
              value={draft.timeline}
              onChange={(v) => set("timeline", v)}
              error={errors.timeline}
            />
          )}

          {step === 5 && (
            <TextField
              id="field-description"
              label="Project details"
              required
              multiline
              value={draft.description}
              onChange={(v) => set("description", v)}
              error={errors.description}
              placeholder="e.g. We'd like to replace the kitchen cabinets and countertop, move the sink to the window, and add more lighting. The kitchen is about 3 × 4 m."
              maxLength={4000}
            />
          )}

          {step === 6 && (
            <FileUploads
              sessionId={draft.uploadSessionId}
              files={draft.files}
              onChange={setFiles}
              onBusyChange={setUploading}
            />
          )}

          {step === 7 && (
            <div className="space-y-6">
              <TextField
                id="field-fullName"
                label="Full name"
                required
                value={draft.fullName}
                onChange={(v) => set("fullName", v)}
                error={errors.fullName}
                autoComplete="name"
                maxLength={120}
              />
              <TextField
                id="field-phone"
                label="Phone"
                type="tel"
                required
                value={draft.phone}
                onChange={(v) => set("phone", v)}
                error={errors.phone}
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
              />
              <TextField
                id="field-email"
                label="Email"
                type="email"
                required
                value={draft.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
                autoComplete="email"
                inputMode="email"
                maxLength={200}
              />
              <p className="text-xs leading-relaxed text-muted">
                We&apos;ll only use your details to respond to this request.
              </p>
              {/* Honeypot: visually hidden, skipped by keyboard and screen readers. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={draft.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {serverError && (
          <p role="alert" className="mt-8 flex items-start gap-3 border-l-4 border-danger bg-danger/5 p-4 text-sm text-danger">
            <WarningCircleIcon size={20} className="mt-px shrink-0" aria-hidden="true" />
            {serverError}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className={buttonClasses("outline-dark")}>
              <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" /> Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={uploading || submitting} className={buttonClasses("primary")}>
            {submitting ? (
              <>
                <SpinnerGapIcon size={18} className="animate-spin" aria-hidden="true" /> Sending…
              </>
            ) : uploading ? (
              <>
                <SpinnerGapIcon size={18} className="animate-spin" aria-hidden="true" /> Uploading…
              </>
            ) : isLast ? (
              <>
                Send my request <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
              </>
            ) : (
              <>
                {step === 6 && draft.files.length === 0 ? "Skip" : "Continue"}{" "}
                <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Progress({ current, label }: { current: number; label: string }) {
  const total = QUESTION_COUNT + 1;
  return (
    <div className="mb-8">
      <p className="eyebrow text-accent" aria-live="polite">
        Step {current} of {total}
        <span className="sr-only">: {label}</span>
      </p>
      <div
        className="mt-3 h-1.5 overflow-hidden bg-line"
        role="progressbar"
        aria-label="Questionnaire progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <div
          className={cx("h-full bg-accent transition-[width] duration-500 ease-out")}
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
