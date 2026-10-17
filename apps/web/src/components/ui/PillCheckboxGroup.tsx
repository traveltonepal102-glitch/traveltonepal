type PillCheckboxGroupProps<T extends string> = {
  legend: string;
  options: readonly { value: T; label: string }[];
  selected: readonly T[];
  onToggle: (value: T) => void;
};

/** Multi-select as pill buttons; real checkboxes underneath for keyboard and screen readers. */
export const PillCheckboxGroup = <T extends string>({ legend, options, selected, onToggle }: PillCheckboxGroupProps<T>) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="mb-2 text-label tracking-wider text-muted-foreground uppercase">{legend}</legend>
    {/* Pills size to their text and wrap as whole pills, so labels never break mid-word. */}
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <label key={option.value} className="grow cursor-pointer">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={selected.includes(option.value)}
            onChange={() => onToggle(option.value)}
          />
          <span className="flex min-h-9.5 items-center justify-center rounded-md border border-line bg-page px-3 text-center text-caption whitespace-nowrap text-ink transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring hover:border-line-strong">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);
