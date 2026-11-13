import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// 16px text: smaller makes iPhones zoom in when a field is tapped.
const CONTROL = "w-full rounded-[10px] border border-solid bg-snow px-3.5 text-base text-ink placeholder:text-muted focus-visible:border-forest aria-invalid:border-[#b42318]";

type FieldProps = { name: string; label: string; error?: string; isOptional?: boolean; hint?: string };

/** The label over its control, and under it a hint or what is wrong. */
const Field = ({ name, label, error, isOptional, hint, children }: FieldProps & { children: ReactNode }) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <label htmlFor={`contact-${name}`} className="text-[15px] leading-5.5 font-semibold text-ink">
      {label}
      {isOptional && <span className="font-normal text-muted"> (optional)</span>}
    </label>
    {children}
    {error ? (
      <p id={`contact-${name}-error`} className="text-sm leading-5 font-semibold text-[#b42318]">
        {error}
      </p>
    ) : (
      hint && <p className="text-sm leading-5 text-muted">{hint}</p>
    )}
  </div>
);

const describedBy = (name: string, error?: string) => ({ "aria-invalid": error ? true : undefined, "aria-describedby": error ? `contact-${name}-error` : undefined });

export const TextField = ({ name, label, error, isOptional, hint, ...input }: FieldProps & InputHTMLAttributes<HTMLInputElement>) => (
  <Field name={name} label={label} error={error} isOptional={isOptional} hint={hint}>
    <input id={`contact-${name}`} name={name} required={!isOptional} {...describedBy(name, error)} {...input} className={`${CONTROL} min-h-12 ${error ? "" : "border-field"}`} />
  </Field>
);

export const SelectField = ({ name, label, error, isOptional, hint, options, ...select }: FieldProps & { options: readonly string[] } & SelectHTMLAttributes<HTMLSelectElement>) => (
  <Field name={name} label={label} error={error} isOptional={isOptional} hint={hint}>
    <select id={`contact-${name}`} name={name} {...describedBy(name, error)} {...select} className={`${CONTROL} min-h-12 cursor-pointer ${error ? "" : "border-field"}`}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </Field>
);

export const TextAreaField = ({ name, label, error, isOptional, hint, ...area }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <Field name={name} label={label} error={error} isOptional={isOptional} hint={hint}>
    <textarea id={`contact-${name}`} name={name} required={!isOptional} {...describedBy(name, error)} {...area} className={`${CONTROL} resize-y py-3 ${error ? "" : "border-field"}`} />
  </Field>
);
