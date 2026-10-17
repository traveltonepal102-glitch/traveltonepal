import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

type FinderOption = { value: string; label: string };

type FinderSelectProps = {
  /** Query parameter name the form sends, e.g. "region". */
  name: string;
  label: string;
  icon: IconName;
  /** First option, meaning "no filter". */
  anyLabel: string;
  options: readonly FinderOption[];
};

/** One labelled dropdown of the trek finder. */
export const FinderSelect = ({ name, label, icon, anyLabel, options }: FinderSelectProps) => {
  const id = `trek-finder-${name}`;

  return (
    <div className="flex grow basis-50 items-center gap-3 rounded-lg bg-muted px-3.5 py-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
      <Icon name={icon} size={22} className="flex-none text-brand" />
      <div className="flex min-w-0 flex-1 flex-col">
        <label htmlFor={id} className="text-eyebrow text-text uppercase">
          {label}
        </label>
        {/* 16px text: smaller makes iPhones zoom in when the field is tapped. */}
        <select
          id={id}
          name={name}
          defaultValue=""
          className="min-h-7.5 w-full cursor-pointer bg-transparent py-0.5 text-base font-bold text-ink outline-none"
        >
          <option value="">{anyLabel}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
