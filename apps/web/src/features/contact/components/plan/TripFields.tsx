import { useId } from "react";

import { GROUP_OPTIONS, MAX_LENGTHS, WHEN_OPTIONS } from "../../tripMessage";
import type { TripDetails } from "../../tripMessage";
import { FIELD, FOCUS } from "../styles";

type TripFieldsProps = {
  trip: TripDetails;
  trekOptions: readonly string[];
  onChange: (patch: Partial<TripDetails>) => void;
};

const LABEL = "flex flex-col gap-1.5 text-caption font-bold text-ink";

/** Name, country, trek, timing, group size and an optional question. */
export const TripFields = ({ trip, trekOptions, onChange }: TripFieldsProps) => {
  const groupLabelId = useId();

  return (
    <>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className={LABEL}>
          Your name
          <input
            type="text"
            autoComplete="name"
            maxLength={MAX_LENGTHS.name}
            value={trip.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="e.g. Anna"
            className={`${FIELD} min-h-11.5`}
          />
        </label>
        <label className={LABEL}>
          Country
          <input
            type="text"
            autoComplete="country-name"
            maxLength={MAX_LENGTHS.country}
            value={trip.country}
            onChange={(event) => onChange({ country: event.target.value })}
            placeholder="e.g. Germany"
            className={`${FIELD} min-h-11.5`}
          />
        </label>
        <label className={LABEL}>
          Trek you are interested in
          <select value={trip.trek} onChange={(event) => onChange({ trek: event.target.value })} className={`${FIELD} min-h-11.5 cursor-pointer`}>
            {trekOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className={LABEL}>
          When
          <select value={trip.when} onChange={(event) => onChange({ when: event.target.value })} className={`${FIELD} min-h-11.5 cursor-pointer`}>
            {WHEN_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <span id={groupLabelId} className="text-caption font-bold text-ink">
          Group size
        </span>
        <div role="group" aria-labelledby={groupLabelId} className="flex flex-wrap gap-1.5">
          {GROUP_OPTIONS.map((option) => {
            const isActive = option === trip.group;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChange({ group: option })}
                className={`min-h-10 cursor-pointer rounded-full border px-3.5 text-caption font-bold transition-colors ${FOCUS} ${
                  isActive ? "border-brand bg-brand text-on-brand" : "border-line-strong bg-surface text-text hover:border-brand"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <label className={LABEL}>
        Your question (optional)
        <textarea
          rows={3}
          maxLength={MAX_LENGTHS.note}
          value={trip.note}
          onChange={(event) => onChange({ note: event.target.value })}
          placeholder="e.g. Is it OK for a first trek? Can we add a rest day?"
          className={`${FIELD} resize-y py-3`}
        />
      </label>
    </>
  );
};
