import { CONTACT } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { OFFICE_DIRECTIONS, REPLY_LANGUAGES } from "../../contactContent";
import { CARD } from "../styles";

const ROWS: readonly { icon: IconName; text: string; note: string }[] = [
  { icon: "location_on", text: CONTACT.officeAddress, note: OFFICE_DIRECTIONS },
  { icon: "schedule", text: CONTACT.officeHours, note: "Saturday closed; WhatsApp still answered." },
  { icon: "call", text: `${CONTACT.phoneDisplay} (WhatsApp)`, note: "WhatsApp is the fastest way to reach us" },
  { icon: "translate", text: REPLY_LANGUAGES.text, note: REPLY_LANGUAGES.note },
];

/** "Office and hours": address, opening hours, phone and the languages we reply in. */
export const OfficeDetails = () => (
  <div className={`${CARD} flex flex-col gap-3`}>
    <h3 className="text-xl font-extrabold">Office and hours</h3>
    <ul className="flex flex-col gap-3">
      {ROWS.map((row) => (
        <li key={row.icon} className="flex items-start gap-2.5">
          <span aria-hidden="true" className="inline-flex size-8.5 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
            <Icon name={row.icon} size={18} />
          </span>
          <span className="flex flex-col leading-snug">
            <span className="text-[15px] font-semibold text-ink">{row.text}</span>
            <span className="text-caption font-normal text-muted-foreground">{row.note}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);
