import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { SocialIcon } from "@/components/ui/SocialIcon";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import type { SiteSettings } from "@/features/site-settings/types";

import { FOOTER_HEADING, FOOTER_LINK } from "./footerStyles";

const ROUND_ICON = "inline-flex size-10 flex-none items-center justify-center rounded-full bg-white/7 text-saffron";

type FooterContactProps = Pick<SiteSettings, "officeAddress" | "officeHours" | "email" | "phoneDisplay" | "social">;

/** The footer's office, ways to reach us and social links, from Site settings; each is left out while blank. */
export const FooterContact = ({ officeAddress, officeHours, email, phoneDisplay, social }: FooterContactProps) => (
  <div className="grid gap-8 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
    {officeAddress && (
      <div>
        <h2 className={FOOTER_HEADING}>Our office</h2>
        <p className="flex gap-3.5">
          <span className={ROUND_ICON}>
            <TrailIcon name="pin" size={18} />
          </span>
          <span>
            <span className="text-[17px] text-paper">{officeAddress}</span>
            {officeHours && <span className="block text-sm text-on-ink-muted">{officeHours}</span>}
          </span>
        </p>
      </div>
    )}
    {(email || phoneDisplay) && (
      <div>
        <h2 className={FOOTER_HEADING}>Reach us</h2>
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {email && (
            <li className="flex items-center gap-3.5">
              <span className={ROUND_ICON}>
                <TrailIcon name="mail" size={18} />
              </span>
              <a href={getEmailUrl()} rel="nofollow" className={`${FOOTER_LINK} text-base [overflow-wrap:anywhere]`}>
                {email}
              </a>
            </li>
          )}
          {phoneDisplay && (
            <li className="flex items-center gap-3.5">
              <span className={`${ROUND_ICON} text-on-ink-whatsapp`}>
                <WhatsAppLogo size={18} />
              </span>
              <a href={getWhatsAppUrl()} target="_blank" rel="nofollow noopener" className={`${FOOTER_LINK} text-[17px]`}>
                {phoneDisplay}
              </a>
            </li>
          )}
        </ul>
      </div>
    )}
    {social.length > 0 && (
      <div>
        <h2 className={FOOTER_HEADING}>Follow</h2>
        <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
          {social.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex size-11 items-center justify-center rounded-full border border-solid border-white/20 bg-white/4 text-paper hover:border-saffron hover:text-saffron"
              >
                <SocialIcon label={link.label} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
