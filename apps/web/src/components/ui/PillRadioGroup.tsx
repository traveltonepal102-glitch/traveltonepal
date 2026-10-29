import { useId } from "react";

type PillRadioGroupProps<T extends string> = {
  legend: string;
  /** The first pill, meaning "no choice", e.g. "Any length". */
  anyLabel: string;
  options: readonly { value: T; label: string }[];
  selected: T | null;
  onChange: (value: T | null) => void;
};

const PILL =
  "flex min-h-9.5 items-center justify-center rounded-md border border-line bg-page px-3 text-center text-caption whitespace-nowrap text-ink transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring hover:border-line-strong";

/** One choice as pill buttons; real radio buttons underneath for keyboard and screen readers. */
export const PillRadioGroup = <T extends string>({ legend, anyLabel, options, selected, onChange }: PillRadioGroupProps<T>) => {
  const name = useId();
  const pills = [{ value: null, label: anyLabel }, ...options];

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-label tracking-wider text-muted-foreground uppercase">{legend}</legend>
      {/* Pills size to their text and wrap as whole pills, so labels never break mid-word. */}
      <div className="flex flex-wrap gap-1.5">
        {pills.map((pill) => (
          <label key={pill.value ?? "any"} className="grow cursor-pointer">
            <input
              type="radio"
              name={name}
              className="peer sr-only"
              checked={selected === pill.value}
              onChange={() => onChange(pill.value)}
            />
            <span className={PILL}>{pill.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
