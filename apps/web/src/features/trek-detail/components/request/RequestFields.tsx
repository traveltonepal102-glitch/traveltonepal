"use client";

import { Icon } from "@ttn/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ttn/ui/select";
import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

import type { SelectOption } from "./useTrekRequest";

const LABEL = "flex flex-col gap-1 text-xs font-bold tracking-wider text-text uppercase";
// 16px text: smaller makes iPhones zoom in when a field is tapped.
const FIELD =
  "rounded-md border bg-surface px-3 py-2.25 text-base font-normal tracking-normal text-ink normal-case focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

const fieldBorder = (error?: string) => (error ? "border-danger" : "border-line-strong");

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <span id={id} className="text-xs font-semibold tracking-normal text-danger normal-case">
      {message}
    </span>
  ) : null;

type ErrorProps = { label: string; error?: string };

/** Ids that tie a field to its error message for screen readers. */
const useErrorIds = (error?: string) => {
  const errorId = useId();
  return { errorId, describedBy: { "aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId : undefined } };
};

export const TextField = ({ label, error, className = "", ...inputProps }: ErrorProps & InputHTMLAttributes<HTMLInputElement>) => {
  const { errorId, describedBy } = useErrorIds(error);
  return (
    <label className={LABEL}>
      {label}
      <input {...describedBy} {...inputProps} className={`${FIELD} ${fieldBorder(error)} ${className}`} />
      <FieldError id={errorId} message={error} />
    </label>
  );
};

export const TextAreaField = ({ label, error, ...areaProps }: ErrorProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const { errorId, describedBy } = useErrorIds(error);
  return (
    <label className={LABEL}>
      {label}
      <textarea {...describedBy} {...areaProps} className={`${FIELD} ${fieldBorder(error)} resize-y`} />
      <FieldError id={errorId} message={error} />
    </label>
  );
};

type SelectFieldProps = { label: string; value: string; options: readonly SelectOption[]; onChange: (value: string) => void };

/** shadcn Select (Base UI) styled as our form field; the label is tied to the trigger button. */
export const SelectField = ({ label, value, options, onChange }: SelectFieldProps) => {
  const triggerId = useId();

  // min-w-0: the trigger's text doesn't wrap, so in a grid cell it would otherwise widen the page on small phones.
  return (
    <div className={`${LABEL} min-w-0`}>
      <label htmlFor={triggerId}>{label}</label>
      <Select items={options} value={value} onValueChange={(next) => next !== null && onChange(next)}>
        <SelectTrigger
          id={triggerId}
          className={`${FIELD} ${fieldBorder()} h-auto w-full cursor-pointer pr-2.5 data-[size=default]:h-auto`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-md">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="cursor-pointer py-2 text-body-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/** A read-only value laid out like a field, e.g. the trek name. */
export const StaticField = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className={LABEL}>
    {label}
    <p className={`${FIELD} ${fieldBorder()} bg-page font-semibold`}>{children}</p>
  </div>
);

export const WhatsAppSubmit = ({ children, isTall = false }: { children: ReactNode; isTall?: boolean }) => (
  <button
    type="submit"
    className={`flex cursor-pointer items-center justify-center gap-2 rounded-md bg-whatsapp px-4 font-display text-body-sm font-extrabold tracking-[0.06em] text-white uppercase shadow-[0_4px_10px_rgba(21,128,61,0.25)] hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${isTall ? "min-h-13" : "min-h-12"}`}
  >
    {children}
  </button>
);

/** "Nothing is stored on this website. Prefer email? Send it by email" */
export const EmailFallback = ({ href }: { href: string }) => (
  <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
    <Icon name="lock" size={14} />
    Nothing is stored on this website. Prefer email?{" "}
    <a href={href} className="rounded-sm font-bold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring">
      Send it by email
    </a>
  </p>
);
