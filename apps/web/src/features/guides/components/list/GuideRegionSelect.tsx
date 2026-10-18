import type { RegionOption } from "../../guideLists";

type GuideRegionSelectProps = {
  value: string | null;
  regions: readonly RegionOption[];
  onChange: (region: string | null) => void;
};

/** "Region" menu beside the "Latest guides" title (same look as the Treks sort menu). Full width on phones. */
export const GuideRegionSelect = ({ value, regions, onChange }: GuideRegionSelectProps) => {
  if (regions.length === 0) return null;

  return (
    <label className="inline-flex items-center gap-2.5 text-caption font-normal text-muted-foreground max-sm:w-full">
      Region
      {/* 16px text: smaller makes iPhones zoom in when the menu is tapped. */}
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="min-h-10.5 cursor-pointer rounded-md border border-line-strong bg-surface px-3 text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring max-sm:flex-1 sm:min-w-45"
      >
        <option value="">All regions</option>
        {regions.map((region) => (
          <option key={region.slug} value={region.slug}>
            {region.name}
          </option>
        ))}
      </select>
    </label>
  );
};
