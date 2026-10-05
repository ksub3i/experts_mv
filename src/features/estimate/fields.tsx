"use client";

import { CheckIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import type { IconProps } from "@phosphor-icons/react";
import { cx } from "@/lib/utils";

export type Option = { value: string; label: string; icon?: React.ComponentType<IconProps> };

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-3 flex items-center gap-2 text-sm text-danger">
      <WarningCircleIcon size={16} className="shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

const cardBase =
  "group relative flex min-h-14 cursor-pointer items-center gap-3 border bg-paper px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-150 " +
  "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink " +
  "hover:border-ink/50";

const cardState = (checked: boolean) =>
  checked ? "border-ink bg-surface shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-line";

/** Single choice shown as cards (native radios, so arrow keys work). */
export function ChoiceCards({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  columns = 2,
}: {
  name: string;
  legend: string;
  options: readonly Option[];
  value?: string;
  onChange: (v: string) => void;
  error?: string;
  columns?: 1 | 2;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="sr-only">{legend}</legend>
      <div className={cx("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
        {options.map((o) => {
          const checked = value === o.value;
          const Icon = o.icon;
          return (
            <label key={o.value} className={cx(cardBase, cardState(checked))}>
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {Icon && <Icon size={28} weight="light" className="shrink-0 text-ink" aria-hidden="true" />}
              <span className="flex-1 font-semibold text-ink">{o.label}</span>
              <span
                aria-hidden="true"
                className={cx(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  checked ? "border-ink bg-ink text-paper" : "border-line",
                )}
              >
                {checked && <CheckIcon size={12} weight="bold" />}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

/** Multiple choice shown as cards (native checkboxes). */
export function CheckCards({
  name,
  legend,
  options,
  values,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: readonly Option[];
  values: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="sr-only">{legend}</legend>
      <p className="mb-4 text-sm text-muted">Choose all that apply.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const checked = values.includes(o.value);
          return (
            <label key={o.value} className={cx(cardBase, cardState(checked))}>
              <input
                type="checkbox"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(checked ? values.filter((v) => v !== o.value) : [...values, o.value])}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cx(
                  "flex h-5 w-5 shrink-0 items-center justify-center border-2",
                  checked ? "border-ink bg-ink text-paper" : "border-line",
                )}
              >
                {checked && <CheckIcon size={12} weight="bold" />}
              </span>
              <span className="flex-1 font-semibold text-ink">{o.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required,
  multiline,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  placeholder?: string;
  maxLength?: number;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const control = cx(
    "w-full border bg-paper px-4 py-3 text-base text-ink transition-colors outline-none",
    "focus:border-ink focus:ring-2 focus:ring-ink/20",
    error ? "border-danger" : "border-line hover:border-muted",
  );
  const common = {
    id,
    value,
    maxLength,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
    "aria-required": required || undefined,
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        ) : (
          <span className="ml-2 font-medium tracking-normal text-muted normal-case">(optional)</span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea rows={7} className={cx(control, "min-h-44 resize-y")} {...common} />
      ) : (
        <input type={type} autoComplete={autoComplete} inputMode={inputMode} className={cx(control, "min-h-12")} {...common} />
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
