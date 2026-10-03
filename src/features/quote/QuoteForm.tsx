"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon, SpinnerGapIcon, WarningCircleIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { quoteSchema, type QuoteInput } from "./schema";
import { quoteSteps, type QuoteField } from "./steps";
import { buttonClasses } from "@/components/ui/Button";
import { cx } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const defaultValues: QuoteInput = { fullName: "", email: "", phone: "", location: "", details: "", website: "" };

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(quoteSchema), mode: "onBlur", defaultValues });

  // Move focus to the confirmation so screen-reader and keyboard users land on it.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const current = quoteSteps[step];
  const isLast = step === quoteSteps.length - 1;
  const multiStep = quoteSteps.length > 1;

  const goNext = async () => {
    const ok = await trigger(current.fields.map((f) => f.name), { shouldFocus: true });
    if (ok) setStep((s) => s + 1);
  };

  const onSubmit = handleSubmit(async (data) => {
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("success");
      reset(defaultValues);
      setStep(0);
    } catch (err) {
      setStatus("error");
      setServerError(
        `${err instanceof Error ? err.message : "Something went wrong."} You can also reach us by email or phone.`,
      );
    }
  });

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 border border-line bg-surface p-8 outline-none md:p-12"
      >
        <CheckCircleIcon size={48} weight="light" className="text-success" aria-hidden="true" />
        <h2 className="display text-3xl">Thanks — request received.</h2>
        <p className="leading-relaxed text-muted">
          We&apos;ll review your project details and get back to you with clear next steps within [X] business
          days.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className={buttonClasses("outline-dark", "mt-2")}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Free quote request" className="space-y-8">
      {multiStep && (
        <div>
          <p className="eyebrow text-muted">
            Step {step + 1} of {quoteSteps.length} — {current.title}
          </p>
          <div className="mt-3 h-1 bg-line" aria-hidden="true">
            <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${((step + 1) / quoteSteps.length) * 100}%` }} />
          </div>
        </div>
      )}

      <p className="text-sm text-muted">
        Fields marked <span aria-hidden="true" className="text-danger">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {current.fields.map((field) => (
          <Field key={field.name} field={field} error={errors[field.name]?.message} register={register} />
        ))}
      </div>

      {/* Honeypot: visually hidden, skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-start gap-3 border-l-4 border-danger bg-danger/5 p-4 text-sm text-danger">
          <WarningCircleIcon size={20} className="mt-px shrink-0" aria-hidden="true" />
          {serverError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {multiStep && step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className={buttonClasses("outline-dark")}>
            Back
          </button>
        )}
        {isLast ? (
          <button type="submit" disabled={status === "submitting"} className={buttonClasses("primary")}>
            {status === "submitting" ? (
              <>
                <SpinnerGapIcon size={18} className="animate-spin" aria-hidden="true" /> Sending…
              </>
            ) : (
              <>
                Submit request <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
              </>
            )}
          </button>
        ) : (
          <button type="button" onClick={goNext} className={buttonClasses("primary")}>
            Continue <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  field,
  error,
  register,
}: {
  field: QuoteField;
  error?: string;
  register: ReturnType<typeof useForm<QuoteInput>>["register"];
}) {
  const id = `quote-${field.name}`;
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = cx(
    "w-full border bg-paper px-4 py-3 text-base text-ink transition-colors outline-none",
    "focus:border-accent focus:ring-2 focus:ring-accent/25",
    error ? "border-danger" : "border-line hover:border-muted",
  );

  const common = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": field.required || undefined,
    ...register(field.name),
  };

  return (
    <div className={cx("flex flex-col gap-2", field.wide && "sm:col-span-2")}>
      <label htmlFor={id} className="eyebrow text-ink">
        {field.label}
        {field.required && (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        )}
      </label>
      {field.hint && (
        <p id={hintId} className="text-sm text-muted">
          {field.hint}
        </p>
      )}
      {field.type === "textarea" ? (
        <textarea rows={6} className={cx(control, "min-h-36 resize-y")} {...common} />
      ) : (
        <input type={field.type ?? "text"} autoComplete={field.autoComplete} className={cx(control, "min-h-12")} {...common} />
      )}
      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-2 text-sm text-danger">
          <WarningCircleIcon size={16} className="shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
