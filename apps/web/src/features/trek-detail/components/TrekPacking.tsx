import { Icon } from "@ttn/ui/icon";

import type { TrekDetail } from "../types";
import { SectionHeading } from "./SectionHeading";
import { PANEL } from "./styles";

type TrekPackingProps = Pick<TrekDetail, "shortName" | "packing">;

/** "Gear and essentials": what to pack, in four cards. */
export const TrekPacking = ({ shortName, packing }: TrekPackingProps) => (
  <section id="packing" aria-labelledby="trek-packing-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading id="trek-packing-title" eyebrow="Gear and essentials" title={`${shortName} packing list`} description={packing.intro} />
    <div className="grid gap-4 md:grid-cols-2">
      {packing.groups.map((group) => (
        <div key={group.title} className={`${PANEL} flex flex-col gap-3 p-5`}>
          <h3 className="flex items-center gap-2.5 border-b border-line pb-2 text-[15px] font-bold">
            <Icon name={group.icon} className="flex-none text-brand" />
            {group.title}
          </h3>
          <ul className="flex flex-col gap-2 text-xs text-text">
            {group.items.map((item) => (
              <li key={item.title} className="flex items-start gap-2">
                <Icon name="check" size={16} className="flex-none text-whatsapp" />
                <p>
                  <strong className="text-ink">{item.title}:</strong> {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);
