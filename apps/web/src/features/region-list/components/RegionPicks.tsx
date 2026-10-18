import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";

import { ICON_TONES } from "@/components/shared/iconTones";
import type { IconTone } from "@/components/shared/iconTones";

import type { RegionListItem } from "../regionListItems";
import { RegionListHeading } from "./RegionListHeading";
import { WRAP } from "./styles";

type RegionPick = { icon: IconName; tone: IconTone; title: string; slugs: readonly string[]; why: string };

/** Quick advice by traveller type, from the website design. */
const PICKS: readonly RegionPick[] = [
  {
    icon: "timer",
    tone: "brand",
    title: "Only a week?",
    slugs: ["mardi-himal", "langtang", "tamang-heritage-trail"],
    why: "Short access from Kathmandu or Pokhara, no domestic flights.",
  },
  {
    icon: "mountain_flag",
    tone: "saffron",
    title: "The famous views",
    slugs: ["everest", "annapurna"],
    why: "Everest Base Camp, Kala Patthar and the Annapurna Sanctuary.",
  },
  {
    icon: "landscape",
    tone: "green",
    title: "Away from the crowds",
    slugs: ["manaslu", "nar-phu", "kanchenjunga"],
    why: "Remote circuits and restricted areas with few trekkers.",
  },
  {
    icon: "cottage",
    tone: "navy",
    title: "Culture and villages",
    slugs: ["tamang-heritage-trail", "pikey-peak"],
    why: "Homestays, monasteries and lower altitudes.",
  },
];

/** "Which region suits you?": four kinds of trip, each with the regions that fit it. */
export const RegionPicks = ({ regions }: { regions: readonly RegionListItem[] }) => (
  <section aria-labelledby="regions-picks-title" className="border-y border-line bg-surface py-10">
    <div className={`${WRAP} flex flex-col gap-4.5`}>
      <RegionListHeading id="regions-picks-title" kicker="Quick picks" title="Which region suits you?" />
      <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {PICKS.map((pick) => (
          <li key={pick.title} className="flex flex-col gap-2.5 rounded-lg border border-line bg-page p-4.5">
            <span aria-hidden="true" className={`inline-flex size-10.5 items-center justify-center rounded-xl ${ICON_TONES[pick.tone]}`}>
              <Icon name={pick.icon} size={22} />
            </span>
            <h3 className="text-base font-bold">{pick.title}</h3>
            <ul className="flex flex-wrap gap-1.5">
              {pick.slugs.flatMap((slug) => regions.find((region) => region.slug === slug) ?? []).map((region) => (
                <li key={region.slug}>
                  <Link
                    href={region.href}
                    className="inline-flex rounded-full border border-[#d3e3f1] bg-surface px-2.5 py-1 text-xs font-bold text-navy hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {region.shortName ?? region.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">{pick.why}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
