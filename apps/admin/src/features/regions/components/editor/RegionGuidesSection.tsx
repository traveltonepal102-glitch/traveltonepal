import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { FormSection } from "@/components/ui/FormSection";
import { Switch } from "@/components/ui/Switch";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { TREKKING_GUIDES_PATH } from "@/features/trekking-guides/constants";
import type { GuideOption } from "@/features/trekking-guides/lib/guideOptions";

type RegionGuidesSectionProps = {
  regionName: string;
  /** Every guide with this region in Trekking guides, A–Z. */
  guides: GuideOption[];
  hiddenGuideIds: string[];
};

/**
 * "Your guides" on the region page (design: section "guides"): filled in from Trekking guides, with a switch
 * to leave anyone out. Sent as regionGuideListed (every guide here) and regionGuideShown (the ones switched on).
 */
export const RegionGuidesSection = ({ regionName, guides, hiddenGuideIds }: RegionGuidesSectionProps) => {
  const name = regionName.trim() || "this region";

  return (
    <FormSection title={`Guides who lead in ${name}`}>
      <p className="m-0 -mt-2 text-xs text-muted-foreground">
        Filled in by itself from{" "}
        <Link href={TREKKING_GUIDES_PATH} className="font-bold text-brand">
          Trekking guides
        </Link>{" "}
        (anyone with {name} in their regions). Switch off anyone you don’t want on the region page.
      </p>
      {guides.length ? (
        <ul className="m-0 grid list-none gap-2.5 p-0 tablet:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.id}>
              <input type="hidden" name="regionGuideListed" value={guide.id} />
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-solid border-border p-3 hover:border-line-strong has-[[role=switch]:not(:checked)]:bg-page">
                <span className="inline-flex size-11 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-tint text-brand">
                  {guide.photo ? <PhotoImage photo={guide.photo} alt="" sizes="44px" className="h-full w-full object-cover" /> : <Icon name="person" size={24} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-ink">{guide.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[guide.roleLine, guide.languages.join(", ")].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <Switch name="regionGuideShown" value={guide.id} label={`Show ${guide.name} on the region page`} defaultChecked={!hiddenGuideIds.includes(guide.id)} />
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 rounded-lg border border-dashed border-line-strong bg-page px-4 py-6 text-center text-caption text-muted-foreground">
          No guides lead in {name} yet. In{" "}
          <Link href={TREKKING_GUIDES_PATH} className="font-bold text-brand">
            Trekking guides
          </Link>
          , tick {name} in a guide’s regions, and they show here.
        </p>
      )}
    </FormSection>
  );
};
