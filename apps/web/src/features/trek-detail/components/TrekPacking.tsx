import { Icon } from "@ttn/ui/icon";

import { TREK_SECTION_IDS } from "../sections";
import type { TrekDetail } from "../types";
import { SectionHeading } from "./SectionHeading";
import { PANEL } from "./styles";

type TrekPackingProps = Pick<TrekDetail, "packing"> & { heading: string };

/** "Gear and essentials": what to pack, in four cards. */
export const TrekPacking = ({ heading, packing }: TrekPackingProps) => (
  <section id={TREK_SECTION_IDS.usefulInfo} aria-labelledby="trek-packing-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading id="trek-packing-title" eyebrow="Gear and essentials" title={heading} description={packing.intro} />
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
