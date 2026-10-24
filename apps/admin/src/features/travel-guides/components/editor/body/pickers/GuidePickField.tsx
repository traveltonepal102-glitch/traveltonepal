import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useId } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { NEW_GUIDE_PATH } from "@/features/trekking-guides/constants";

import type { SectionContext } from "../../../../lib/sectionContext";

type GuidePickFieldProps = {
  label: string;
  guideId: string | null;
  guides: SectionContext["guides"];
  region: SectionContext["region"];
  error?: string;
  onChange: (guideId: string | null) => void;
};

/** One trekking guide: those who lead treks in the guide's region first (design: "Suggested"), then the others. */
export const GuidePickField = ({ label, guideId, guides, region, error, onChange }: GuidePickFieldProps) => {
  const id = useId();
  const guide = guides.find((item) => item.id === guideId);
  const inRegion = region ? guides.filter((item) => item.regionIds.includes(region.id)) : [];
  const others = guides.filter((item) => !inRegion.includes(item));
  const option = (item: SectionContext["guides"][number]) => (
    <option key={item.id} value={item.id} disabled={!item.hasConsent}>
      {item.name} · {item.role}
      {item.hasConsent ? "" : " (hasn’t agreed to be shown)"}
    </option>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex size-10 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-tint text-brand">
          {guide?.photo ? <PhotoImage photo={guide.photo} alt="" sizes="40px" className="h-full w-full object-cover" /> : <Icon name="person" size={22} />}
        </span>
        <select
          id={id}
          value={guideId ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClass, "max-w-105 min-w-0 flex-1 cursor-pointer pr-8")}
        >
          <option value="">Pick a guide</option>
          {inRegion.length > 0 && <optgroup label={`Suggested · lead treks in ${region?.name}`}>{inRegion.map(option)}</optgroup>}
          {others.length > 0 && <optgroup label={inRegion.length ? "Other guides" : "Trekking guides"}>{others.map(option)}</optgroup>}
        </select>
        <Link href={NEW_GUIDE_PATH} className="inline-flex items-center gap-1 text-caption font-bold text-brand">
          <Icon name="add" size={16} />
          Add a new guide
        </Link>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
};
