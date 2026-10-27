"use client";

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import { useId, useState } from "react";
import type { ChangeEvent } from "react";

import { SourceNote } from "@/components/editor/SourceNote";
import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { TREKKING_GUIDES_PATH } from "@/features/trekking-guides/constants";
import { guideSuggestions } from "@/features/trekking-guides/lib/guideOptions";
import type { GuideOption } from "@/features/trekking-guides/lib/guideOptions";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_TREK_GUIDES } from "../../../constants";

type TrekGuidesSectionProps = {
  guideIds: string[];
  options: GuideOption[];
  /** The trek's region (as last saved), to suggest its guides first. */
  regionId: string;
  regionName: string;
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * "Meet your trek guide" on the trek page (design: section "guides"). Guides are picked from Trekking guides,
 * in page order, and sent as guideId; their photo and bio are edited once, there.
 */
export const TrekGuidesSection = ({ guideIds, options, regionId, regionName, errors, onEdit }: TrekGuidesSectionProps) => {
  const selectId = useId();
  // A guide removed since the last save drops out here.
  const [picked, setPicked] = useState(() => guideIds.filter((id) => options.some((option) => option.id === id)));
  const pickedGuides = picked.flatMap((id) => options.filter((option) => option.id === id));
  const { inRegion, others } = guideSuggestions(options, picked, regionId);

  const change = (next: string[]) => {
    setPicked(next);
    onEdit();
  };
  const move = (index: number, to: number) => {
    const next = [...picked];
    [next[index], next[to]] = [next[to], next[index]];
    change(next);
  };
  const handleAdd = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) change([...picked, event.target.value]);
  };

  return (
    <FormSection title="Guides on this trek">
      <p className="m-0 -mt-2 text-xs text-muted-foreground">The order here is the order on the trek page.</p>
      <SourceNote shownIn="“Meet your trek guide” (each guide's name, photo, languages and bio)" from={{ href: TREKKING_GUIDES_PATH, label: "Trekking guides" }} />
      {pickedGuides.length > 0 && (
        <ul className="m-0 grid list-none gap-3 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
          {pickedGuides.map((guide, index) => (
            <li key={guide.id} className="flex flex-col gap-2 rounded-lg border border-solid border-border bg-page p-3">
              <input type="hidden" name="guideId" value={guide.id} />
              <div className="flex items-start gap-2.5">
                <span className="inline-flex size-12 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-tint text-brand">
                  {guide.photo ? <PhotoImage photo={guide.photo} alt="" sizes="48px" className="h-full w-full object-cover" /> : <Icon name="person" size={26} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 font-bold text-ink">
                    <span className="truncate">{guide.name}</span>
                    {guide.isLicensed && <Icon name="verified" size={15} aria-label="Licence checked" className="flex-none text-brand" />}
                  </span>
                  <span className="block text-caption text-muted-foreground">{guide.roleLine}</span>
                  <span className="block truncate text-xs text-muted-foreground">{guide.languages.join(", ")}</span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-solid border-border pt-2">
                <span className="text-xs font-bold text-brand">#{index + 1} on the page</span>
                <span className="flex gap-0.5">
                  <button type="button" className={ghostIconButton} aria-label={`Move ${guide.name} earlier`} disabled={index === 0} onClick={() => move(index, index - 1)}>
                    <Icon name="arrow_back" size={18} />
                  </button>
                  <button type="button" className={ghostIconButton} aria-label={`Move ${guide.name} later`} disabled={index === pickedGuides.length - 1} onClick={() => move(index, index + 1)}>
                    <Icon name="arrow_forward" size={18} />
                  </button>
                  <button type="button" className={ghostIconButton} aria-label={`Remove ${guide.name} from this trek`} onClick={() => change(picked.filter((id) => id !== guide.id))}>
                    <Icon name="close" size={18} />
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!pickedGuides.length && <p className="m-0 text-caption text-muted-foreground">No guides yet: the trek page leaves “Meet your trek guide” out.</p>}

      {picked.length < MAX_TREK_GUIDES && inRegion.length + others.length > 0 && (
        <div className="flex max-w-105 flex-col gap-1.5">
          <label htmlFor={selectId} className={labelClass}>
            Add a guide
          </label>
          {/* Resets to the placeholder after each pick (value is always ""). */}
          <select id={selectId} value="" onChange={handleAdd} className={`${inputClass} cursor-pointer pr-8`}>
            <option value="">Pick a guide…</option>
            {inRegion.length > 0 && (
              <optgroup label={`Lead treks in ${regionName || "this region"}`}>
                {inRegion.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} ({option.roleLine})
                  </option>
                ))}
              </optgroup>
            )}
            {others.length > 0 && (
              <optgroup label="Other guides">
                {others.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} ({option.roleLine})
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
      )}
      {!options.length && (
        <p className="m-0 text-caption text-muted-foreground">
          No trekking guides yet.{" "}
          <Link href={TREKKING_GUIDES_PATH} className="font-bold text-brand">
            Add them in Trekking guides
          </Link>
          , then pick them here.
        </p>
      )}
      <FieldError id="trek-guides-error" message={errors.guideIds} />
    </FormSection>
  );
};
