import { useId } from "react";
import type { ComponentProps } from "react";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  hint?: string;
};

export const TextField = ({ label, hint, className = "", ...inputProps }: TextFieldProps) => {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-label text-ink">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        className={`m-0 h-11 rounded-md border border-solid border-input bg-surface px-3 font-sans text-body text-ink shadow-none outline-none transition-[border-color,box-shadow] placeholder:text-subtle focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 disabled:opacity-60 ${className}`}
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="m-0 text-caption text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
};
