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

const NAV_LINK = "inline-flex min-h-11 items-center rounded-full px-3.5 whitespace-nowrap text-ink no-underline hover:bg-ocean-tint hover:text-ocean";
const MENU_CONTACT_LINK = "inline-flex min-h-11 items-center gap-2.5 text-ink no-underline hover:text-ocean";
const PAGE_LINKS = [
  { href: ROUTES.blogs, label: "Blog" },
  { href: ROUTES.about, label: "Über uns" },
  { href: ROUTES.contact, label: "Kontakt" },
] as const;

/**
 * The header (design: canvas "Everest Trek Website", Header; decided 2026-11-18: no strip above it): a white bar with
 * the logo, the menu ("Treks" with the main trek first, Blog, Über uns, Kontakt) and the "E-Mail" and "Trek planen"
 * buttons. Below lg: the logo, "Trek planen" and the menu button, which opens the menu in a panel (MobileMenu) with the
 * WhatsApp number and email from Site settings.
 */
export const SiteHeader = async () => {
  const [{ phoneDisplay, email }, { trekCard, otherTreks }] = await Promise.all([getSiteSettings(), getHomeData()]);
  const otherTreksMenu: NavMenu = {
    label: "Treks",
    items: [...(trekCard ? [trekCard] : []), ...otherTreks].map((other) => ({ href: other.hasPage ? other.href : "/#other-treks", title: other.name, text: trekFacts(other), image: other.image })),
    more: { href: "/#other-treks", label: "Alle unsere Treks" },
  };
  const emailHref = getEmailUrl({ subject: `Trekplanung mit ${SITE_NAME}` });

  return (
    <header className="print:hidden">
      <div className="border-0 border-b border-solid border-line bg-snow">
        <div className="wrap flex min-h-21.5 items-center justify-between gap-4">
          {/* Loaded normally (not "eager"): React preloads every eager image, and the logo would compete with the hero photo, the page's LCP image. */}
          <Link href={ROUTES.home} aria-label={`${SITE_NAME}, Startseite`} className="inline-flex flex-none">
            <Image src="/brand/logo-header.png" alt={SITE_NAME} width={415} height={156} sizes="(min-width: 640px) 160px, 128px" className="h-12 w-auto sm:h-15" />
          </Link>
          <nav aria-label="Hauptmenü" className="flex items-center gap-1 max-lg:hidden">
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
                E-Mail
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
                      <TrailIcon name="mail" size={18} className="text-ocean" />
                      {email}
                    </a>
                  )}
                </p>
              )}
              <PlanTrekButton hasWhatsApp={Boolean(phoneDisplay)} className="w-full" />
              {email && (
                <a href={emailHref} rel="nofollow" className={`${outlineButton} w-full`}>
                  <TrailIcon name="mail" />
                  E-Mail schreiben
                </a>
              )}
            </MobileMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
