import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { outlineOnDarkButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getHomeData } from "@/features/home/services/homeRepository";
import type { HomeSectionKey } from "@/features/home/types";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

/** A link; one with `section` jumps to that part of the home page, so it is shown only while the main trek has that part. */
type FooterLink = { label: string; href: string; section?: HomeSectionKey };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "The trek",
    links: [
      { label: "Itinerary", href: "/#itinerary", section: "itinerary" },
      { label: "Prices", href: "/#pricing", section: "pricing" },
      { label: "What's included", href: "/#inclusions", section: "inclusions" },
      { label: "Questions", href: "/#faq", section: "faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: ROUTES.about },
      { label: "Contact", href: ROUTES.contact },
      { label: "Blogs", href: ROUTES.blogs },
      { label: "Reviews", href: "/#reviews", section: "reviews" },
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

/** The footer: the website's details (those filled in), its links, and the way to ask. */
export const SiteFooter = async () => {
  const [{ officeAddress, officeHours, legalName, licence, panNumber, social, year }, { trek, reviews }] = await Promise.all([getSiteSettings(), getHomeData()]);
  // The reviews part is also left out while there are no reviews to show.
  const hasSection = (section: HomeSectionKey) => Boolean(trek?.sections.includes(section)) && (section !== "reviews" || reviews.length > 0);
  const columns = COLUMNS.map((column) => ({ ...column, links: column.links.filter((link) => !link.section || hasSection(link.section)) })).filter((column) => column.links.length > 0);
  const legalLine = [`© ${year} ${SITE_NAME}`, legalName, licence && `Licence ${licence}`, panNumber && `PAN ${panNumber}`].filter(Boolean).join(" · ");

  return (
    <footer className="bg-forest-deep text-[15px] leading-6 text-on-forest-muted print:hidden">
      <div className="wrap flex flex-col gap-9 pt-14 pb-7">
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-[1_1_260px] flex-col gap-3.5">
            <Image src="/brand/logo-footer.png" alt={SITE_NAME} width={1999} height={1884} sizes="150px" className="h-auto w-37.5" />
            <p>Private treks in the Manaslu Conservation Area, on the day you choose and at your own pace.</p>
            {officeAddress && (
              <p className="flex items-start gap-2">
                <TrailIcon name="pin" className="mt-0.75 text-saffron" />
                <span>
                  {officeAddress}
                  <br />
                  {officeHours}
                </span>
              </p>
            )}
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-[1_1_150px] flex-col sm:gap-2">
              <span className="text-eyebrow font-semibold tracking-[0.12em] text-saffron uppercase">{column.title}</span>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href} className="py-2 text-on-forest-muted no-underline hover:text-snow sm:py-0.5">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-[14px] bg-white/6 px-6 py-5">
          <span className="font-display text-[22px] leading-7 font-semibold text-snow">Questions about your trek?</span>
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

        <div className="flex flex-wrap justify-between gap-3 text-sm leading-5">
          <span>{legalLine}</span>
          {social.length > 0 && (
            <span className="flex flex-wrap gap-4">
              {social.map((link) => (
                <a key={link.label} href={link.href} rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-on-forest-muted hover:text-snow sm:min-h-6">
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
