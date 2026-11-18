import { ClampedText } from "@/components/shared/ClampedText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Tabs } from "@/components/shared/Tabs";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeTrek } from "../types";
import { HeadingLine } from "./HeadingLine";

/**
 * The packing list (design: Gear and essentials, decided 2026-11-18 for long lists): the groups as tabs down the left
 * with their counts, and the chosen group's items as a two-column list in a card. A long list shows its first rows and
 * "Weiterlesen"; every item of every group is in the HTML (only hidden or cut off), so search engines read them all.
 */
export const TrekPacking = ({ packing }: { packing: HomeTrek["packing"] }) => (
  <section aria-labelledby="packing-h" id="packing" className="flex flex-col gap-8">
    <SectionHeading id="packing-h" eyebrow="Ausrüstung" title={packing.heading}>
      <HeadingLine doc={packing.line} />
    </SectionHeading>
    <Tabs
      label="Packliste"
      isVertical
      tabs={packing.groups.map((group) => ({ title: group.title, note: String(group.items.length) }))}
      panels={packing.groups.map((group) => (
        <div key={group.title} className="rounded-3xl border border-solid border-line bg-snow px-7 pt-6 pb-4 max-sm:px-4.5">
          <p className="m-0 flex max-w-none items-baseline justify-between gap-4 border-0 border-b border-solid border-line pb-4">
            <strong className="font-display text-xl leading-7 font-bold text-ink">{group.title}</strong>
            <span className="flex-none text-sm text-muted">{group.items.length === 1 ? "1 Teil" : `${group.items.length} Teile`}</span>
          </p>
          <ClampedText lines={15} className="pt-1 text-[15px] leading-6">
            <ul className="m-0 grid list-none gap-x-8 p-0 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.title} className="flex gap-3 border-0 border-b border-solid border-ice py-3.5">
                  <span aria-hidden="true" className="mt-0.5 inline-flex size-6 flex-none items-center justify-center rounded-full bg-ocean text-snow">
                    <TrailIcon name="check" size={13} />
                  </span>
                  <p className="m-0 [--text-measure:none]">
                    <strong className="block text-base leading-6 font-semibold text-ink">{item.title}</strong>
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </ClampedText>
        </div>
      ))}
    />
  </section>
);
