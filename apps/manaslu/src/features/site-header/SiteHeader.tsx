import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { outlineButton, outlineOnDarkButton } from "@/components/ui/buttonStyles";
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

const NAV_LINK = "inline-flex min-h-11 items-center whitespace-nowrap text-snow no-underline hover:text-saffron";
const MENU_CONTACT_LINK = "inline-flex min-h-11 items-center gap-2.5 text-ink no-underline hover:text-forest";
const BAR_LINK = "inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap text-snow no-underline hover:text-saffron";
/** A button that shows only its icon until there is room for its word. */
const ICON_FIRST = "w-12 px-0! xl:w-auto xl:px-5!";
const PAGE_LINKS = [
  { href: ROUTES.updates, label: "Manaslu Updates" },
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.contact, label: "Contact" },
] as const;

/**
 * A dark green header: the bar of company details (those filled in) across the whole width, with the white logo at the
 * header's full height in front of it, and the menu and buttons under the bar. Below lg: the logo, "Plan my trek" and the
 * menu button, which opens the menu in a panel (MobileMenu); on phones the bar is left out and its number and address
 * are in that panel.
 * The columns line up with the page's 1392px content (`wrap`: the logo's 214px and the 1178px beside it).
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
    <header className="grid grid-cols-[var(--gutter)_minmax(0,1fr)_auto_var(--gutter)] bg-forest-deep text-snow lg:grid-cols-[minmax(var(--gutter),1fr)_214px_minmax(0,1178px)_minmax(var(--gutter),1fr)] print:hidden">
      <Link href={ROUTES.home} aria-label={`${SITE_NAME}, home`} className="col-start-2 row-start-2 inline-flex flex-none items-center justify-self-start py-2 lg:relative lg:z-10 lg:row-span-2 lg:row-start-1 lg:-ml-6 lg:justify-self-stretch lg:bg-forest-deep lg:pl-6">
        <Image src="/brand/logo-header-light.png" alt={SITE_NAME} width={640} height={263} sizes="(min-width: 1024px) 190px, 130px" loading="eager" className="h-13.5 w-auto max-w-none max-[389px]:h-12 lg:h-19.5" />
      </Link>
      {hasBar && (
        <>
          <div aria-hidden="true" className="col-span-full row-start-1 border-0 border-b border-solid border-white/10 max-md:hidden" />
          <div className="col-start-2 col-end-4 row-start-1 flex min-w-0 items-center justify-between gap-x-6 py-2 text-sm leading-5 text-on-forest-muted max-md:hidden lg:col-start-3 lg:col-end-4 lg:pl-5">
            <p className="flex min-w-0 gap-x-6 overflow-hidden whitespace-nowrap">
              {tourismRegistration && <span>Govt reg: {tourismRegistration}</span>}
              {licence && <span className="max-xl:hidden">Licence: {licence}</span>}
              {memberships.length > 0 && <span className="max-xl:hidden">Member of {memberships.join(", ")}</span>}
            </p>
            <p className="flex flex-none gap-x-5">
              {phoneDisplay && (
                <a href={getWhatsAppUrl()} rel="nofollow" className={BAR_LINK}>
                  <WhatsAppLogo size={14} />
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
        </>
      )}
      <div className="contents lg:col-start-3 lg:row-start-2 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:py-3.5 lg:pl-5">
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-4 font-semibold max-lg:hidden xl:gap-x-6.5">
          <NavDropdown {...otherTreksMenu} />
          <NavDropdown {...blogsMenu} hasTwoColumns />
          {PAGE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 row-start-2 flex items-center gap-2 self-center sm:gap-2.5">
          {/* On phones the menu has the address and this button. */}
          {email && (
            <a href={emailHref} rel="nofollow" className={`${outlineOnDarkButton} ${ICON_FIRST} max-sm:hidden`}>
              <TrailIcon name="mail" />
              <span className="sr-only xl:not-sr-only">Email</span>
            </a>
          )}
          {/* Below 360px it covers the logo: the menu has the number and this button. */}
          <PlanTrekButton hasWhatsApp={Boolean(phoneDisplay)} isOnDark className="max-sm:px-3.5! max-[359px]:hidden" />
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
                    <TrailIcon name="mail" size={18} className="text-forest" />
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
    </header>
  );
};
