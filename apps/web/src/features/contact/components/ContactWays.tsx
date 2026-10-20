import { CONTACT, getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import type { ReactNode } from "react";

import { ICON_TONES } from "@/components/shared/iconTones";
import type { IconTone } from "@/components/shared/iconTones";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SITE_NAME } from "@/lib/site";

import { REPLY_TIMES } from "../contactContent";
import { CONTACT_SECTION_IDS } from "../sections";
import { WRAP } from "./styles";

type WayCardProps = {
  icon: IconName;
  tone: IconTone;
  title: string;
  text: string;
  isRecommended?: boolean;
  children: ReactNode;
};

const WayCard = ({ icon, tone, title, text, isRecommended = false, children }: WayCardProps) => (
  <li
    className={`flex flex-col gap-3.5 rounded-2xl bg-surface p-4.5 shadow-popover md:p-6 ${isRecommended ? "border-2 border-whatsapp" : "border border-line"}`}
  >
    <div className="flex items-center justify-between gap-2.5">
      <span aria-hidden="true" className={`inline-flex size-12 items-center justify-center rounded-xl ${isRecommended ? "bg-whatsapp text-white" : ICON_TONES[tone]}`}>
        <Icon name={icon} size={26} />
      </span>
      {isRecommended && <span className="rounded-full bg-green-tint px-2.5 py-1 text-xs font-extrabold text-[#0f5e2e]">Fastest · Recommended</span>}
    </div>
    <div className="flex flex-col gap-1">
      <h2 className="text-[22px] font-extrabold">{title}</h2>
      <p className="text-body-sm text-text">{text}</p>
    </div>
    {children}
  </li>
);

const Note = ({ icon, className, children }: { icon: IconName; className: string; children: ReactNode }) => (
  <p className="inline-flex items-center gap-1.5 text-caption font-normal text-text">
    <Icon name={icon} size={16} className={className} />
    {children}
  </p>
);

/** WhatsApp (recommended), email, and visiting or calling the office; overlaps the bottom of the hero. */
export const ContactWays = () => (
  <section aria-label="Ways to reach us" className="relative -mt-16 pb-10">
    <ul className={`${WRAP} grid gap-4.5 lg:grid-cols-[1.25fr_1fr_1fr]`}>
      <WayCard icon="chat" tone="green" title="WhatsApp" text="Chat, send voice notes or share your dates. Most people plan their whole trek here." isRecommended>
        <p className="font-display text-[22px] font-extrabold text-[#0f5e2e]">{CONTACT.phoneDisplay}</p>
        <Note icon="schedule" className="text-whatsapp">
          {REPLY_TIMES.whatsApp}
        </Note>
        <ButtonLink href={getWhatsAppUrl("Hello! I'd like to plan a trek with you.")} variant="whatsapp" icon="chat" shape="rounded" isExternal className="mt-auto">
          Chat on WhatsApp
        </ButtonLink>
      </WayCard>

      <WayCard icon="mail" tone="brand" title="Email" text="Best for longer questions, group trips or documents.">
        <p className="font-display text-[17px] font-bold break-all text-brand">{CONTACT.email}</p>
        <Note icon="schedule" className="text-brand">
          {REPLY_TIMES.email}
        </Note>
        <ButtonLink href={getEmailUrl({ subject: `Question for ${SITE_NAME}` })} variant="secondary" icon="mail" shape="rounded" className="mt-auto">
          Write an email
        </ButtonLink>
      </WayCard>

      <WayCard icon="location_on" tone="saffron" title="Visit or call" text="Already in Kathmandu? Drop in for a chat and a trek briefing.">
        <p className="text-[15px] font-semibold text-ink">{CONTACT.officeAddress}</p>
        <Note icon="call" className="text-saffron-deep">
          <a href={`tel:+${CONTACT.phoneDigits}`} className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-ring">
            {CONTACT.phoneDisplay}
          </a>
        </Note>
        <ButtonLink href={`#${CONTACT_SECTION_IDS.office}`} variant="secondary" icon="map" shape="rounded" className="mt-auto">
          See map and hours
        </ButtonLink>
      </WayCard>
    </ul>
  </section>
);
