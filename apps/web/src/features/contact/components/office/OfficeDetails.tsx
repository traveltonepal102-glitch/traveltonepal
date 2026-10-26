import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { OFFICE_DIRECTIONS } from "../../contactContent";
import { CARD } from "../styles";

/** "Office and hours": address, opening hours, phone and the languages we reply in (from Site settings). */
export const OfficeDetails = async () => {
  const { contact, replyLanguages } = await getSiteSettings();
  const rows: { icon: IconName; text: string; note: string }[] = [
    { icon: "location_on", text: contact.officeAddress, note: OFFICE_DIRECTIONS },
    { icon: "schedule", text: contact.officeHours, note: "Closed days: WhatsApp is still answered." },
    { icon: "call", text: contact.phoneDisplay && `${contact.phoneDisplay} (WhatsApp)`, note: "WhatsApp is the fastest way to reach us" },
    { icon: "translate", text: replyLanguages.join(", "), note: "The languages we reply in" },
  ];

  return (
  <div className={`${CARD} flex flex-col gap-3`}>
    <h3 className="text-xl font-extrabold">Office and hours</h3>
    <ul className="flex flex-col gap-3">
      {rows.filter((row) => row.text).map((row) => (
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
};
