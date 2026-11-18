import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import type { SiteSettings } from "@/features/site-settings/types";

import { FOOTER_HEADING, FOOTER_LINK } from "./footerStyles";

const ICON = "mt-0.5 inline-flex size-8 flex-none items-center justify-center rounded-lg bg-white/8 text-glacier";

type FooterContactProps = Pick<SiteSettings, "officeAddress" | "officeHours" | "email" | "phoneDisplay">;

/** The footer's "Kontakt" column: the office with its hours, WhatsApp and email, from Site settings; each left out while blank. */
export const FooterContact = ({ officeAddress, officeHours, email, phoneDisplay }: FooterContactProps) =>
  (officeAddress || email || phoneDisplay) && (
    <div className="col-span-2 sm:col-span-1">
      <h2 className={FOOTER_HEADING}>Kontakt</h2>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {phoneDisplay && (
          <li className="flex gap-3">
            <span className={`${ICON} text-on-ink-whatsapp`}>
              <WhatsAppLogo size={16} />
            </span>
            <a href={getWhatsAppUrl()} target="_blank" rel="nofollow noopener" className={`${FOOTER_LINK} font-semibold text-snow`}>
              {phoneDisplay}
            </a>
          </li>
        )}
        {email && (
          <li className="flex gap-3">
            <span className={ICON}>
              <TrailIcon name="mail" size={16} />
            </span>
            <a href={getEmailUrl()} rel="nofollow" className={`${FOOTER_LINK} [overflow-wrap:anywhere]`}>
              {email}
            </a>
          </li>
        )}
        {officeAddress && (
          <li className="flex gap-3">
            <span className={ICON}>
              <TrailIcon name="pin" size={16} />
            </span>
            <span className="text-[15px] leading-6">
              {officeAddress}
              {officeHours && <span className="block text-sm text-on-ink-muted">{officeHours}</span>}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
