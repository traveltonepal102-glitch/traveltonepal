import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import Image from "next/image";

import { ROUTES } from "@/lib/routes";

import { TREK_COLUMNS } from "../navigation";
import { MenuColumnTitle, MenuItemLink, PanelCard, PanelFooter } from "./MenuParts";

const TrekAdviceCard = () => (
  <a
    href={getWhatsAppUrl()}
    target="_blank"
    rel="noopener noreferrer"
    className="relative flex min-h-57.5 flex-col justify-end gap-2 overflow-hidden rounded-lg bg-navy p-4.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <Image src="/images/trekkers-on-trail.jpg" alt="" fill sizes="300px" className="object-cover opacity-55" />
    <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/95 to-navy/10" />
    <span className="relative font-display text-h4">Not sure which trek fits you?</span>
    <span className="relative text-caption font-normal text-navy-text">
      Tell us your dates and fitness. A local expert suggests the right route.
    </span>
    <span className="relative inline-flex items-center gap-1.5 self-start rounded-full bg-whatsapp px-3.5 py-2 text-caption font-bold">
      <Icon name="chat" size={16} />
      Ask on WhatsApp
    </span>
  </a>
);

export const TreksMenu = () => (
  <PanelCard className="p-6">
    <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.1fr)] gap-7">
      {TREK_COLUMNS.map((column) => (
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
      note="[COUNT] treks across 9 regions · private treks on your dates"
      linkLabel="View all treks"
      href={ROUTES.treks}
    />
  </PanelCard>
);
