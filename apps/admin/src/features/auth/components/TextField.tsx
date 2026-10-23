import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  hint?: string;
  /** Icon inside the field, on the left. */
  icon?: IconName;
  /** A control inside the field, on the right (e.g. show password). */
  trailing?: ReactNode;
  isInvalid?: boolean;
};

export const TextField = ({ label, hint, icon, trailing, isInvalid = false, className = "", ...inputProps }: TextFieldProps) => {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.75">
      <label htmlFor={inputId} className="text-body-sm font-bold text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && <Icon name={icon} size={20} className="pointer-events-none absolute top-3.5 left-3.5 text-muted-foreground" />}
        <input
          id={inputId}
          aria-describedby={hintId}
          aria-invalid={isInvalid || undefined}
          className={`m-0 box-border h-12 w-full rounded-xl border border-solid bg-surface font-sans text-[15px] text-ink shadow-none outline-none transition-[border-color,box-shadow] placeholder:text-subtle focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15 disabled:opacity-60 ${
            isInvalid ? "border-[#f87171]" : "border-input"
          } ${icon ? "pl-11" : "pl-3.5"} ${trailing ? "pr-11" : "pr-3.5"} ${className}`}
          {...inputProps}
        />
        {trailing && <div className="absolute top-1.5 right-1.5">{trailing}</div>}
      </div>
      {hint && (
        <p id={hintId} className="m-0 text-caption text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
};
