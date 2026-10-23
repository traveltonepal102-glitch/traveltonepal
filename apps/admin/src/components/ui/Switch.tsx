import type { ChangeEvent } from "react";

type SwitchProps = {
  name: string;
  /** Sent when on (a checkbox: nothing is sent when off). */
  value?: string;
  /** What it switches, for screen readers, e.g. "Show Reviews". */
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * An on/off switch (design: .ad-switch), built on a real checkbox with role="switch". Put it inside a
 * <label> with the visible text so the whole row toggles it.
 */
export const Switch = ({ name, value = "on", label, checked, defaultChecked, onChange }: SwitchProps) => (
  <>
    <input
      type="checkbox"
      role="switch"
      name={name}
      value={value}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      aria-label={label}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className="relative h-6.5 w-11 flex-none rounded-full bg-line-strong transition-colors peer-checked:bg-whatsapp peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring after:absolute after:top-1 after:left-1 after:size-4.5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4.5"
    />
  </>
);
