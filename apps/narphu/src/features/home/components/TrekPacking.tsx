import { SectionHeading } from "@/components/shared/SectionHeading";
import { Tabs } from "@/components/shared/Tabs";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeTrek } from "../types";
import { HeadingLine } from "./HeadingLine";

/** The packing list (design: Gear and essentials): a tab per group, each item with what it is for. */
export const TrekPacking = ({ packing }: { packing: HomeTrek["packing"] }) => (
  <section aria-labelledby="packing-h" id="packing" className="flex flex-col gap-7">
    <SectionHeading id="packing-h" eyebrow="Gear and essentials" title={packing.heading}>
      <HeadingLine doc={packing.line} />
    </SectionHeading>
    <Tabs
      label="Packing list"
      tabs={packing.groups.map((group) => ({ title: group.title }))}
      panels={packing.groups.map((group) => (
        <ul key={group.title} className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5 rounded-[20px] border border-solid border-line bg-snow p-7 max-sm:p-4">
          {group.items.map((item) => (
            <li key={item.title} className="flex gap-3 rounded-2xl bg-paper p-4">
              <span aria-hidden="true" className="inline-flex size-6.5 flex-none items-center justify-center rounded-full border-2 border-solid border-maroon text-maroon">
                <TrailIcon name="check" size={14} />
              </span>
              <p className="m-0 text-[15px] leading-5.5">
                <strong className="block text-base font-semibold text-ink">{item.title}</strong>
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      ))}
    />
  </section>
);
