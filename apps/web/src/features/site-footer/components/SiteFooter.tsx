import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";

import { PreferredSourceBadge } from "@/components/shared/PreferredSourceBadge";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { MAIN_SECTIONS } from "@/lib/navigation";

import { COMPANY_LINKS } from "../footerLinks";
import { FooterBottomBar } from "./FooterBottomBar";
import { FooterContactBand } from "./FooterContactBand";
import { FooterLinkColumn } from "./FooterLinkColumn";
import { FOOTER_LINK } from "./footerStyles";

/** Shared website footer (design: Footer.dc.html). */
export const SiteFooter = async () => {
  const { contact, social } = await getSiteSettings();
  return (
    <footer className="bg-ink text-body-sm text-footer-text">
      <FooterContactBand />
      <div className="mx-auto flex max-w-content flex-col gap-11 px-4 pt-10 pb-7 md:px-6 md:pt-14">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-9 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Image src="/brand/logo-white.svg" alt="Travel To Nepal" width={98} height={56} className="h-14 w-auto self-start" />
            <p className="max-w-70">
              Treks across nine regions of Nepal, led by local guides and planned with you on WhatsApp.
            </p>
            {(contact.registrationNumber || contact.taanMemberNumber) && (
              <p className="text-footer-muted">
                {[contact.registrationNumber && `Govt. reg. ${contact.registrationNumber}`, contact.taanMemberNumber && `TAAN ${contact.taanMemberNumber}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>

          <FooterLinkColumn title="Explore" links={MAIN_SECTIONS} />
          <FooterLinkColumn title="Company" links={COMPANY_LINKS} />

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-eyebrow text-white uppercase">Talk to us</h2>
            <address className="flex flex-col gap-2.5 not-italic">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`${FOOTER_LINK} self-start font-bold text-whatsapp-on-dark`}
              >
                WhatsApp {contact.phoneDisplay}
              </a>
              <a href={getEmailUrl()} className={`${FOOTER_LINK} self-start`}>
                {contact.email}
              </a>
              <span>{contact.officeAddress}</span>
            </address>
            {social.length > 0 && (
              <ul aria-label="Follow us" className="flex flex-wrap gap-2">
                {social.map((profile) => (
                  <li key={profile.network}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`${profile.label} (opens in a new tab)`}
                      title={profile.label}
                      className={`${FOOTER_LINK} inline-flex size-10 items-center justify-center rounded-full border border-white/15 hover:border-white/40 hover:bg-white/10`}
                    >
                      <SocialIcon network={profile.network} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <PreferredSourceBadge theme="light" />
          </div>
        </div>

        <FooterBottomBar />
      </div>
    </footer>
  );
};
