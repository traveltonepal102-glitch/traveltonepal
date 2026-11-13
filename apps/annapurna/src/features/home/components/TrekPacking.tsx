import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeTrek } from "../types";
import { HeadingLine } from "./HeadingLine";

/** The packing list by group. */
export const TrekPacking = ({ packing }: { packing: HomeTrek["packing"] }) => (
  <section aria-labelledby="packing-h" id="packing" className="flex flex-col gap-5">
    <SectionHeading id="packing-h" title={packing.heading}>
      <HeadingLine doc={packing.line} />
    </SectionHeading>
    {/* One list under another on a phone, two side by side from sm (four groups make an even 2 × 2). */}
    <div className="grid gap-3 sm:grid-cols-2">
      {packing.groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-2 rounded-[14px] bg-cloud p-4.5">
          <h3 className="font-body! text-base! leading-5.5! font-semibold">{group.title}</h3>
          <ul className="flex flex-col gap-1 text-[15px] leading-5.5">
            {group.items.map((item) => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);
