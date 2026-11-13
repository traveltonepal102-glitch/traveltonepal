import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { FlagStripe } from "@/components/ui/FlagStripe";
import { outlineOnDarkButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

const COLUMNS = [
  {
    title: "The trek",
    links: [
      { label: "Itinerary", href: "/#itinerary" },
      { label: "Prices", href: "/#pricing" },
      { label: "What's included", href: "/#inclusions" },
      { label: "Questions", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: ROUTES.about },
      { label: "Contact", href: ROUTES.contact },
      { label: "Blogs", href: ROUTES.blogs },
      { label: "Reviews", href: "/#reviews" },
    ],
  },
  {
    title: "Useful links",
    links: [
      { label: "Terms", href: ROUTES.terms },
      { label: "Privacy", href: ROUTES.privacy },
      { label: "Impressum", href: ROUTES.impressum },
      { label: "Cookie settings", href: ROUTES.cookies },
    ],
  },
];

/** The footer, in navy under the prayer-flag stripe: the website's details (those filled in), its links, and the way to ask. */
export const SiteFooter = async () => {
  const { officeAddress, officeHours, legalName, licence, panNumber, social, year } = await getSiteSettings();
  const legalLine = [`© ${year} ${SITE_NAME}`, legalName, licence && `Licence ${licence}`, panNumber && `PAN ${panNumber}`].filter(Boolean).join(" · ");

  return (
    <footer className="bg-navy text-[15px] leading-6 text-on-navy-muted print:hidden">
      <FlagStripe />
      <div className="wrap flex flex-col gap-9 pt-14 pb-7">
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-[1_1_260px] flex-col gap-3.5">
            {/* The logo is dark: a white chip keeps it readable on navy. */}
            <span className="inline-flex self-start rounded-[14px] bg-snow px-3.5 py-2.5">
              <Image src="/brand/logo.png" alt={SITE_NAME} width={636} height={235} sizes="130px" className="h-12 w-auto" />
            </span>
            <p>Private treks in the Annapurna Conservation Area, on the day you choose and at your own pace.</p>
            {officeAddress && (
              <p className="flex items-start gap-2">
                <TrailIcon name="pin" className="mt-0.75 text-sun" />
                <span>
                  {officeAddress}
                  <br />
                  {officeHours}
                </span>
              </p>
            )}
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-[1_1_150px] flex-col sm:gap-2">
              <span className="eyebrow eyebrow-on-dark text-xs">{column.title}</span>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href} className="py-2 text-on-navy-muted no-underline hover:text-snow sm:py-0.5">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-[14px] bg-white/6 px-6 py-5">
          <span className="font-display text-[22px] leading-7 font-bold text-snow">Questions about your trek?</span>
          <span className="flex flex-wrap gap-3">
            <a href={getWhatsAppUrl()} rel="nofollow" className={`${whatsAppButton} min-h-11 rounded-full`}>
              <WhatsAppLogo />
              WhatsApp
            </a>
            <a href={getEmailUrl()} rel="nofollow" className={`${outlineOnDarkButton} min-h-11 rounded-full`}>
              Email
            </a>
          </span>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-solid border-white/12 pt-5 text-sm leading-5">
          <span>{legalLine}</span>
          {social.length > 0 && (
            <span className="flex flex-wrap gap-4">
              {social.map((link) => (
                <a key={link.label} href={link.href} rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-on-navy-muted hover:text-snow sm:min-h-6">
                  {link.label}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};
