"use client";

import { Icon } from "@ttn/ui/icon";
import { useId, useState } from "react";
import type { ChangeEvent } from "react";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";

import { MAX_COMPARE_REGIONS } from "../../constants";

type CompareSectionProps = {
  compareRegionIds: string[];
  /** Every other region, A–Z. */
  regions: { id: string; name: string }[];
  error?: string;
  onEdit: () => void;
};

/** "Compare with other regions" at the bottom of the page: up to 4 in order, sent as compareRegionId. */
export const CompareSection = ({ compareRegionIds, regions, error, onEdit }: CompareSectionProps) => {
  const selectId = useId();
  // A region removed since the last save drops out here.
  const [picked, setPicked] = useState(() => compareRegionIds.filter((id) => regions.some((region) => region.id === id)));
  const available = regions.filter((region) => !picked.includes(region.id));
  const nameOf = (id: string) => regions.find((region) => region.id === id)?.name ?? "";

  const change = (next: string[]) => {
    setPicked(next);
    onEdit();
  };
  const move = (index: number) => change(picked.map((id, at) => (at === index - 1 ? picked[index] : at === index ? picked[index - 1] : id)));
  const handleAdd = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) change([...picked, event.target.value]);
  };

  return (
    <FormSection title="Compare with other regions" hint={`Up to ${MAX_COMPARE_REGIONS} region cards at the bottom of the page. Without any, the website picks them.`}>
      {picked.length > 0 ? (
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {picked.map((id, index) => (
            <li key={id} className="flex items-center gap-3 rounded-lg border border-solid border-border bg-page px-3 py-2">
              <input type="hidden" name="compareRegionId" value={id} />
              <span className="inline-flex size-7 flex-none items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">{index + 1}</span>
              <span className="flex-1 font-bold text-ink">{nameOf(id)}</span>
              <button type="button" className={ghostIconButton} aria-label={`Move ${nameOf(id)} up`} disabled={index === 0} onClick={() => move(index)}>
                <Icon name="arrow_upward" size={18} />
              </button>
              <button type="button" className={ghostIconButton} aria-label={`Remove ${nameOf(id)}`} onClick={() => change(picked.filter((other) => other !== id))}>
                <Icon name="close" size={18} />
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="m-0 text-caption text-muted-foreground">None picked: the website shows other regions by itself.</p>
      )}
      {picked.length < MAX_COMPARE_REGIONS && available.length > 0 && (
        <div className="flex max-w-90 flex-col gap-1.5">
          <label htmlFor={selectId} className={labelClass}>
            Add a region
          </label>
          {/* Resets to the placeholder after each pick (value is always ""). */}
          <select id={selectId} value="" onChange={handleAdd} className={`${inputClass} cursor-pointer pr-8`}>
            <option value="">Pick a region…</option>
            {available.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <FieldError id="compare-regions-error" message={error} />
    </FormSection>
  );
};
