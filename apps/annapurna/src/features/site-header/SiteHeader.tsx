import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { FlagStripe } from "@/components/ui/FlagStripe";
import { outlineButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getHomeData } from "@/features/home/services/homeRepository";
import { trekFacts } from "@/features/home/trekFacts";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES, pagePath } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { PlanTrekButton } from "./PlanTrekButton";
import type { NavMenu } from "./types";

const NAV_LINK = "inline-flex min-h-11 items-center whitespace-nowrap font-semibold text-ink no-underline hover:text-ember";
const MENU_CONTACT_LINK = "inline-flex min-h-11 items-center gap-2.5 text-ink no-underline hover:text-navy";
const BAR_LINK = "inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap font-semibold text-ink no-underline hover:text-ember";
/** A button that shows only its icon until there is room for its word. */
const ICON_FIRST = "w-12 px-0! xl:w-auto xl:px-5!";
const PAGE_LINKS = [
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.contact, label: "Contact" },
] as const;

/**
 * A white header under the prayer-flag stripe (design: canvas "Annapurna Trekking Home Page"): the bar of company
 * details (those filled in) on cloud grey, then the logo, the menu, "Email" and "Plan my trek" (the same parts as
 * Manaslu Trek's and Travel To Nepal's headers). Below lg: the logo, the buttons and the menu button, which opens the menu in a panel (MobileMenu); on phones the bar is left out and its number and
 * address are in that panel.
 */
export const SiteHeader = async () => {
  const [{ phoneDisplay, email, licence, tourismRegistration, memberships }, { trekCard, otherTreks, latestGuides }] = await Promise.all([getSiteSettings(), getHomeData()]);
  const hasBar = Boolean(phoneDisplay || email || licence || tourismRegistration || memberships.length);
  const otherTreksMenu: NavMenu = {
    label: "Other treks",
    // The main trek (the home page) first, then the others.
    items: [...(trekCard ? [trekCard] : []), ...otherTreks].map((other) => ({ href: other.hasPage ? other.href : "/#other-treks", title: other.name, text: trekFacts(other), image: other.image })),
    more: trekCard ? { href: "/#compare", label: "Compare the treks" } : { href: "/#other-treks", label: "See the treks" },
  };
  const blogsMenu: NavMenu = {
    label: "Blogs",
    heading: "Latest blogs",
    items: latestGuides.map((guide) => ({ href: pagePath(guide.slug), title: guide.title, text: guide.meta, image: guide.image })),
    more: { href: ROUTES.blogs, label: "View all blogs" },
  };
  const emailHref = getEmailUrl({ subject: `Planning a trek with ${SITE_NAME}` });

  return (
    <header className="bg-snow print:hidden">
      <FlagStripe />
      {hasBar && (
        <div className="bg-cloud text-sm leading-5 text-muted max-md:hidden">
          <div className="wrap flex min-w-0 items-center justify-between gap-x-6 py-2">
            <p className="flex min-w-0 gap-x-6 overflow-hidden whitespace-nowrap">
              {tourismRegistration && <span>Govt reg: {tourismRegistration}</span>}
              {licence && <span className="max-xl:hidden">Licence: {licence}</span>}
              {memberships.length > 0 && <span className="max-xl:hidden">Member of {memberships.join(", ")}</span>}
            </p>
            <p className="flex flex-none gap-x-5">
              {phoneDisplay && (
                <a href={getWhatsAppUrl()} rel="nofollow" className={BAR_LINK}>
                  <span className="text-whatsapp">
                    <WhatsAppLogo size={14} />
                  </span>
                  {phoneDisplay}
                </a>
              )}
              {email && (
                <a href={getEmailUrl()} rel="nofollow" className={BAR_LINK}>
                  {email}
                </a>
              )}
            </p>
          </div>
        </div>
      )}
      <div className="border-b border-solid border-line">
        <div className="wrap flex items-center gap-x-6 py-3 xl:gap-x-8">
          <Link href={ROUTES.home} aria-label={`${SITE_NAME}, home`} className="inline-flex flex-none items-center">
            <Image src="/brand/logo.png" alt={SITE_NAME} width={636} height={235} sizes="(min-width: 1024px) 146px, 119px" loading="eager" className="h-11 w-auto max-w-none lg:h-13.5" />
          </Link>
          <nav aria-label="Main" className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 max-lg:hidden xl:gap-x-6.5">
            <NavDropdown {...otherTreksMenu} />
            <NavDropdown {...blogsMenu} hasTwoColumns />
            {PAGE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={NAV_LINK}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
            {/* On phones the menu has the address and this button. */}
            {email && (
              <a href={emailHref} rel="nofollow" className={`${outlineButton} ${ICON_FIRST} max-sm:hidden`}>
                <TrailIcon name="mail" />
                <span className="sr-only xl:not-sr-only">Email</span>
              </a>
            )}
            {/* Below 360px it covers the logo: the menu has the number and this button. */}
            <PlanTrekButton hasWhatsApp={Boolean(phoneDisplay)} className="max-sm:px-3.5! max-[359px]:hidden" />
            <MobileMenu menus={[otherTreksMenu, blogsMenu]} links={PAGE_LINKS}>
              {(phoneDisplay || email) && (
                <p className="mb-1 flex flex-col gap-1 text-[15px]">
                  {phoneDisplay && (
                    <a href={getWhatsAppUrl()} rel="nofollow" className={MENU_CONTACT_LINK}>
                      <span className="inline-flex text-whatsapp">
                        <WhatsAppLogo size={18} />
                      </span>
                      {phoneDisplay}
                    </a>
                  )}
                  {email && (
                    <a href={getEmailUrl()} rel="nofollow" className={MENU_CONTACT_LINK}>
                      <TrailIcon name="mail" size={18} className="text-azure" />
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
