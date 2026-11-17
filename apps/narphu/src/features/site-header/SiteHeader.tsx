import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { outlineButton, quietButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getHomeData } from "@/features/home/services/homeRepository";
import { trekFacts } from "@/features/home/trekFacts";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { PlanTrekButton } from "./PlanTrekButton";
import type { NavMenu } from "./types";

const NAV_LINK = "inline-flex min-h-11 items-center rounded-full px-3.5 whitespace-nowrap text-ink no-underline hover:bg-maroon-tint hover:text-maroon";
const STRIP_LINK = "inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap text-cream no-underline hover:text-saffron";
const MENU_CONTACT_LINK = "inline-flex min-h-11 items-center gap-2.5 text-ink no-underline hover:text-maroon";
const PAGE_LINKS = [
  { href: ROUTES.blogs, label: "Blogs" },
  { href: ROUTES.about, label: "About us" },
  { href: ROUTES.contact, label: "Contact" },
] as const;

/**
 * The header (design: canvas "Nar Phu Trek Website", Header): a maroon strip with the company's licence line and its
 * WhatsApp number and email (those filled in in Site settings), then a white bar with the logo, the menu ("Other treks"
 * with the main trek first, Blogs, About us, Contact) and the "Email" and "Plan my trek" buttons. Below lg: the logo,
 * "Plan my trek" and the menu button, which opens the menu in a panel (MobileMenu); on phones the strip keeps only the
 * number and address.
 */
export const SiteHeader = async () => {
  const [{ phoneDisplay, email, licence }, { trekCard, otherTreks }] = await Promise.all([getSiteSettings(), getHomeData()]);
  const otherTreksMenu: NavMenu = {
    label: "Other treks",
    items: [...(trekCard ? [trekCard] : []), ...otherTreks].map((other) => ({ href: other.hasPage ? other.href : "/#other-treks", title: other.name, text: trekFacts(other), image: other.image })),
    more: { href: "/#other-treks", label: "See all our treks" },
  };
  const emailHref = getEmailUrl({ subject: `Planning a trek with ${SITE_NAME}` });

  return (
    <header className="print:hidden">
      <div className="bg-maroon text-[13px] leading-5 text-cream">
        <div className="wrap flex min-h-9.5 items-center justify-between gap-4">
          <p className="flex items-center gap-2 max-md:hidden">
            <TrailIcon name="shield" size={14} className="text-saffron" />
            Licensed local trekking agency in Kathmandu
            {licence && <span className="max-lg:hidden">· Licence {licence}</span>}
          </p>
          <p className="flex gap-5 max-md:w-full max-md:justify-between">
            {phoneDisplay && (
              <a href={getWhatsAppUrl()} target="_blank" rel="nofollow noopener" className={STRIP_LINK}>
                <WhatsAppLogo size={14} />
                {phoneDisplay}
              </a>
            )}
            {email && (
              <a href={getEmailUrl()} rel="nofollow" className={STRIP_LINK}>
                <TrailIcon name="mail" size={14} />
                {email}
              </a>
            )}
          </p>
        </div>
      </div>
      <div className="border-0 border-b border-solid border-line bg-snow">
        <div className="wrap flex min-h-20 items-center justify-between gap-4">
          <Link href={ROUTES.home} aria-label={`${SITE_NAME}, home`} className="inline-flex flex-none">
            <Image src="/brand/logo-header.png" alt={SITE_NAME} width={522} height={156} sizes="(min-width: 640px) 161px, 134px" loading="eager" className="h-10 w-auto sm:h-12" />
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1 max-lg:hidden">
            <NavDropdown {...otherTreksMenu} />
            {PAGE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={NAV_LINK}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {email && (
              <a href={emailHref} rel="nofollow" className={`${quietButton} min-h-11.5 px-5! max-sm:hidden`}>
                <TrailIcon name="mail" />
                Email
              </a>
            )}
            {/* Below 360px it would crowd the logo: the menu has it. */}
            <PlanTrekButton hasWhatsApp={Boolean(phoneDisplay)} className="min-h-11.5 max-sm:px-3.5! max-[359px]:hidden" />
            <MobileMenu menus={[otherTreksMenu]} links={PAGE_LINKS}>
              {(phoneDisplay || email) && (
                <p className="mb-1 flex flex-col gap-1 text-[15px]">
                  {phoneDisplay && (
                    <a href={getWhatsAppUrl()} target="_blank" rel="nofollow noopener" className={MENU_CONTACT_LINK}>
                      <span className="inline-flex text-whatsapp">
                        <WhatsAppLogo size={18} />
                      </span>
                      {phoneDisplay}
                    </a>
                  )}
                  {email && (
                    <a href={getEmailUrl()} rel="nofollow" className={MENU_CONTACT_LINK}>
                      <TrailIcon name="mail" size={18} className="text-maroon" />
                      {email}
                    </a>
                  )}
                </p>
              )}
              <PlanTrekButton hasWhatsApp={Boolean(phoneDisplay)} className="w-full" />
              {email && (
                <a href={emailHref} rel="nofollow" className={`${outlineButton} w-full`}>
                  <TrailIcon name="mail" />
                  Email us
                </a>
              )}
            </MobileMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
