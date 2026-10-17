import { Icon } from "@ttn/ui/icon";

export type CheckboxOption = {
  value: string;
  label: string;
  /** Shown on the right, e.g. how many results this option gives. */
  count?: number;
  /** Small color dot before the label (e.g. difficulty). */
  dotClassName?: string;
};

type CheckboxGroupProps = {
  legend: string;
  options: readonly CheckboxOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
};

/** A titled list of real checkboxes (fieldset + legend), styled as the design's square boxes. */
export const CheckboxGroup = ({ legend, options, selected, onToggle }: CheckboxGroupProps) => (
  <fieldset className="flex flex-col gap-1">
    <legend className="mb-1.5 text-label tracking-wider text-muted-foreground uppercase">{legend}</legend>
    {options.map((option) => {
      const isChecked = selected.includes(option.value);
      return (
        <label
          key={option.value}
          className="flex min-h-9 cursor-pointer items-center gap-2.5 rounded-sm px-1 text-body-sm text-ink hover:bg-page has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring"
        >
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isChecked}
            onChange={() => onToggle(option.value)}
          />
          <span
            aria-hidden="true"
            className="inline-flex size-5 flex-none items-center justify-center rounded-sm border-[1.5px] border-line-strong bg-surface text-white peer-checked:border-brand peer-checked:bg-brand"
          >
            {isChecked && <Icon name="check" size={14} />}
          </span>
          <span className="inline-flex flex-1 items-center gap-2">
            {option.dotClassName && <span aria-hidden="true" className={`size-2 rounded-full ${option.dotClassName}`} />}
            {option.label}
          </span>
          {option.count !== undefined && (
            <span className="text-xs text-subtle">
              {option.count}
              <span className="sr-only"> treks</span>
            </span>
          )}
        </label>
      );
    })}
  </fieldset>
);
