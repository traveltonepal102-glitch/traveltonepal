import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import Image from "next/image";

import { ROUTES } from "@/lib/routes";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { TrekColumn } from "../navigation";
import { MenuColumnTitle, MenuItemLink, PanelCard, PanelFooter } from "./MenuParts";

const ADVICE_MESSAGE = "Hello! I'm not sure which trek fits me. Can you suggest one for my dates and fitness?";
const ADVICE_ACTION =
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-caption font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** "Not sure which trek fits you?": a local expert on WhatsApp or by email. */
const TrekAdviceCard = () => (
  <div className="relative flex min-h-57.5 flex-col justify-end gap-2 overflow-hidden rounded-lg bg-navy p-4.5 text-white">
    <Image src="/images/trekkers-on-trail.jpg" alt="" fill sizes="300px" className="object-cover opacity-55" />
    <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/95 to-navy/10" />
    <span className="relative font-display text-h4">Not sure which trek fits you?</span>
    <span className="relative text-caption font-normal text-navy-text">
      Tell us your dates and fitness. A local expert suggests the right route.
    </span>
    <span className="relative flex flex-wrap gap-2">
      <a href={getWhatsAppUrl(ADVICE_MESSAGE)} target="_blank" rel="noopener noreferrer" className={`${ADVICE_ACTION} bg-whatsapp hover:bg-whatsapp/90`}>
        <WhatsAppLogo size={16} />
        WhatsApp
      </a>
      <a href={getEmailUrl({ subject: "Which trek fits me?", body: ADVICE_MESSAGE })} className={`${ADVICE_ACTION} border border-white/55 hover:bg-white/10`}>
        <Icon name="mail" size={16} />
        Email
      </a>
    </span>
  </div>
);

type TreksMenuProps = {
  /** trekColumns: popular treks (when any), by length, by style. */
  columns: readonly TrekColumn[];
  /** The footer line, e.g. "12 treks across 9 regions · private treks on your dates" (treksMenuNote). */
  note: string;
};

export const TreksMenu = ({ columns, note }: TreksMenuProps) => (
  <PanelCard className="p-6">
    <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.1fr)] gap-7">
      {columns.map((column) => (
        <div key={column.title} className="flex flex-col gap-1">
          <MenuColumnTitle>{column.title}</MenuColumnTitle>
          {column.links.map((link) => (
            <MenuItemLink key={link.name} {...link} />
          ))}
        </div>
      ))}
      <TrekAdviceCard />
    </div>
    <PanelFooter
      note={note}
      linkLabel="View all treks"
      href={ROUTES.treks}
    />
  </PanelCard>
);
