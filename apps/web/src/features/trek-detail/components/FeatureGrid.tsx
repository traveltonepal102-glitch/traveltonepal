import { Icon } from "@ttn/ui/icon";

import { ICON_TONES } from "@/components/shared/iconTones";

import type { FeatureItem } from "../types";
import { PANEL } from "./styles";

/**
 * Cards with an icon tile, title and text ("Why book with us", "What makes this trip different").
 * Phones put the icon beside the text so a list of cards does not become a very long column.
 */
export const FeatureGrid = ({ items }: { items: readonly FeatureItem[] }) => (
  <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {items.map((item) => (
      <li key={item.title} className={`${PANEL} flex items-start gap-3.5 p-4.5 md:flex-col md:gap-2.5 md:p-5`}>
        <span aria-hidden="true" className={`inline-flex size-10 flex-none items-center justify-center rounded-md ${ICON_TONES[item.tone]}`}>
          <Icon name={item.icon} size={22} />
        </span>
        <div className="flex flex-col gap-1 md:gap-2.5">
          <h3 className="text-[15px] leading-snug font-bold">{item.title}</h3>
          <p className="text-xs text-text">{item.text}</p>
        </div>
      </li>
    ))}
  </ul>
);
