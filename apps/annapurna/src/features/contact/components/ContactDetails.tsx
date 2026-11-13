import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import type { ContactContent } from "@ttn/site-data/contactContent";
import type { ReactNode } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { SITE_NAME } from "@/lib/site";

type DetailProps = { icon: ReactNode; title: string; note?: string; children: ReactNode };

const Detail = ({ icon, title, note, children }: DetailProps) => (
  <li className="flex items-start gap-3.5 py-4.5 first:pt-0 last:pb-0">
    <span aria-hidden="true" className="inline-flex size-10 flex-none items-center justify-center rounded-[10px] bg-sky text-navy">
      {icon}
    </span>
    <div className="flex min-w-0 flex-col gap-0.5">
      <h3 className="font-body! text-[15px]! leading-5.5! font-semibold! text-muted!">{title}</h3>
      <div className="leading-6 font-semibold break-words text-ink">{children}</div>
      {note && <p className="text-sm leading-5 text-muted">{note}</p>}
    </div>
  </li>
);

const LINK = "text-ink no-underline hover:text-navy hover:underline";

/** The ways to reach us, those filled in Settings. */
export const ContactDetails = async ({ replyTimes }: { replyTimes: ContactContent["replyTimes"] }) => {
  const { phoneDisplay, email, officeAddress, officeHours, replyLanguages, officeMap, social } = await getSiteSettings();

  return (
    <aside aria-labelledby="contact-details-h" className="flex flex-col gap-5 rounded-2xl bg-cloud p-6 md:p-8 lg:sticky lg:top-6 lg:self-start">
      <h2 id="contact-details-h" className="text-[28px]! leading-9!">
        Contact details
      </h2>
      <ul className="flex flex-col divide-y divide-solid divide-line">
        {phoneDisplay && (
          <Detail icon={<WhatsAppLogo size={20} />} title="WhatsApp" note={replyTimes.whatsApp}>
            <a href={getWhatsAppUrl("Hello! I'd like to ask about a trek.")} className={LINK}>
              {phoneDisplay}
            </a>
          </Detail>
        )}
        {email && (
          <Detail icon={<TrailIcon name="mail" size={20} />} title="Email" note={replyTimes.email}>
            <a href={getEmailUrl({ subject: `Question for ${SITE_NAME}` })} className={LINK}>
              {email}
            </a>
          </Detail>
        )}
        {officeAddress && (
          <Detail icon={<TrailIcon name="pin" size={20} />} title="Office">
            {officeMap.url ? (
              <a href={officeMap.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                {officeAddress}
              </a>
            ) : (
              officeAddress
            )}
          </Detail>
        )}
        {officeHours && (
          <Detail icon={<TrailIcon name="clock" size={20} />} title="Office hours" note={replyLanguages.length ? `We reply in ${replyLanguages.join(", ")}.` : undefined}>
            {officeHours}
          </Detail>
        )}
      </ul>
      {social.length > 0 && (
        <ul aria-label="Follow us" className="flex flex-wrap gap-x-4 gap-y-1 border-0 border-t border-solid border-line pt-4 text-[15px] font-semibold">
          {social.map((link) => (
            <li key={link.label}>
              <a href={link.href} rel="noopener noreferrer" className="inline-flex min-h-6 items-center underline underline-offset-2">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};
