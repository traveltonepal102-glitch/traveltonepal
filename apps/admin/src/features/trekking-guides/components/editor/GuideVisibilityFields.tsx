import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { Switch } from "@/components/ui/Switch";
import { trekPath } from "@/features/treks/constants";

import type { TrekkingGuide, TrekkingGuideValues } from "../../types";
import { GuideFormGroup } from "./GuideFormGroup";

type GuideVisibilityFieldsProps = {
  values: TrekkingGuideValues;
  /** The treks the guide is on (saved guides only). */
  treks: TrekkingGuide["treks"];
};

const SWITCHES = [
  { name: "showOnAbout", label: "Show on the About page", sub: "In “Our guides and team”" },
  { name: "canLeadTreks", label: "Can be picked on trek pages", sub: "“Meet your trek guide” section" },
  { name: "canFactCheck", label: "Can check travel guides", sub: "Shown as “Checked by” at the top of travel guides" },
] as const;

/** Where the guide appears (design: "Where this person appears"), and the treks they are on. */
export const GuideVisibilityFields = ({ values, treks }: GuideVisibilityFieldsProps) => (
  <GuideFormGroup title="Where this guide appears">
    {SWITCHES.map((item) => (
      <label key={item.name} className="flex cursor-pointer items-center gap-3 rounded-lg border border-solid border-border p-3 hover:border-line-strong">
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-ink">{item.label}</span>
          <span className="block text-xs text-muted-foreground">{item.sub}</span>
        </span>
        <Switch name={item.name} label={item.label} defaultChecked={values[item.name]} />
      </label>
    ))}
    {treks.length > 0 && (
      <div className="flex flex-col gap-1 rounded-lg bg-page p-3">
        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">On these treks</span>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {treks.map((trek) => (
            <li key={trek.id}>
              <Link href={trekPath(trek.id)} className="inline-flex items-center gap-1.5 text-caption font-semibold text-brand">
                <Icon name="hiking" size={16} />
                {trek.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </GuideFormGroup>
);
