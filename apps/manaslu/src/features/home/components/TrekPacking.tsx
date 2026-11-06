import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeTrek } from "../types";

/** The packing list by group. */
export const TrekPacking = ({ packing }: { packing: HomeTrek["packing"] }) => (
  <section aria-labelledby="packing-h" id="packing" className="flex flex-col gap-5">
    <SectionHeading id="packing-h" title={packing.heading}>
      {packing.intro && <p>{packing.intro}</p>}
    </SectionHeading>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
      {packing.groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-2 rounded-[14px] bg-stone p-4.5">
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
