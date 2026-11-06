import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { outlineButton, primaryButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { CONTACT_SECTIONS } from "@/features/contact/sections";
import { getHomeData } from "@/features/home/services/homeRepository";
import { trekFacts } from "@/features/home/trekFacts";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES, pagePath } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

import { MainTrekLink } from "./MainTrekLink";
import { NavDropdown } from "./NavDropdown";

const NAV_LINK = "inline-flex min-h-11 items-center whitespace-nowrap text-ink no-underline hover:text-forest";
const BAR_LINK = "inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap text-snow no-underline hover:text-saffron";
/** Opens WhatsApp with the logo on it; with no number in Site settings, the contact form. */
const PLAN_BUTTON = `${primaryButton} whitespace-nowrap max-sm:px-3.5!`;
/** A button that shows only its icon until there is room for its word. */
const ICON_FIRST = "w-12 px-0! xl:w-auto xl:px-5!";

/**
 * The logo on white at the header's full height, with the dark bar of company details (those filled in) starting beside
 * it and the menu and buttons under that. On a small screen: the bar across the top, then the logo and buttons, then the menu.
 * The columns line up with the page's 1192px content (the logo's 214px and the 978px beside it).
 */
export const SiteHeader = async () => {
  const [{ phoneDisplay, email, licence, tourismRegistration, memberships }, { trek, otherTreks, latestGuides }] = await Promise.all([getSiteSettings(), getHomeData()]);
  const hasBar = Boolean(phoneDisplay || email || licence || tourismRegistration || memberships.length);

  return (
    <header className="grid grid-cols-[16px_minmax(0,1fr)_auto_16px] border-0 border-b border-solid border-line bg-snow text-ink lg:grid-cols-[minmax(24px,1fr)_214px_minmax(0,978px)_minmax(24px,1fr)] print:hidden">
      <Link href={ROUTES.home} aria-label={`${SITE_NAME}, home`} className="col-start-2 row-start-2 inline-flex flex-none items-center justify-self-start py-2 lg:row-span-2 lg:row-start-1">
        <Image src="/brand/logo-header-dark.png" alt={SITE_NAME} width={640} height={263} sizes="(min-width: 1024px) 190px, 130px" preload className="h-13.5 w-auto max-w-none lg:h-19.5" />
      </Link>
      {hasBar && (
        <>
          <div aria-hidden="true" className="col-span-full row-start-1 bg-forest-deep lg:col-start-3 lg:col-end-5" />
          <div className="col-start-2 col-end-4 row-start-1 flex min-w-0 items-center justify-between gap-x-6 py-2 text-sm leading-5 text-on-forest-muted lg:col-start-3 lg:col-end-4 lg:pl-5">
            <p className="flex min-w-0 gap-x-6 overflow-hidden whitespace-nowrap max-md:hidden">
              {tourismRegistration && <span>Govt reg: {tourismRegistration}</span>}
              {licence && <span className="max-xl:hidden">Licence: {licence}</span>}
              {memberships.length > 0 && <span className="max-xl:hidden">Member of {memberships.join(", ")}</span>}
            </p>
            <p className="flex flex-wrap gap-x-5 gap-y-1 md:flex-none">
              {phoneDisplay && (
                <a href={getWhatsAppUrl()} className={BAR_LINK}>
                  <WhatsAppLogo size={14} />
                  {phoneDisplay}
                </a>
              )}
              {email && (
                <a href={getEmailUrl()} className={BAR_LINK}>
                  {email}
                </a>
              )}
            </p>
          </div>
        </>
      )}
      <div className="contents lg:col-start-3 lg:row-start-2 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:py-3.5 lg:pl-5">
        <nav aria-label="Main" className="col-start-2 col-end-4 row-start-3 flex flex-wrap items-center gap-x-6.5 pb-1 font-medium lg:gap-x-4 lg:pb-0 xl:gap-x-6.5">
          {trek && <MainTrekLink name={trek.name} className={NAV_LINK} />}
          <NavDropdown
            label="Other treks"
            items={otherTreks.map((other) => ({ href: other.hasPage ? other.href : "/#other-treks", title: other.name, text: trekFacts(other), image: other.image }))}
            more={trek ? { href: "/#compare", label: "Compare the treks" } : { href: "/#other-treks", label: "See the treks" }}
          />
          <NavDropdown
            label="Blogs"
            heading="Latest blogs"
            hasTwoColumns
            items={latestGuides.map((guide) => ({ href: pagePath(guide.slug), title: guide.title, text: guide.meta, image: guide.image }))}
            more={{ href: ROUTES.blogs, label: "View all blogs" }}
          />
          <Link href={ROUTES.about} className={NAV_LINK}>
            About
          </Link>
          <Link href={ROUTES.contact} className={NAV_LINK}>
            Contact
          </Link>
        </nav>
        <div className="col-start-3 row-start-2 flex items-center gap-1.5 self-center sm:gap-2.5">
          {/* On the smallest phones the bar above already has the address, and the logo needs the room. */}
          {email && (
            <a href={getEmailUrl({ subject: `Planning a trek with ${SITE_NAME}` })} className={`${outlineButton} ${ICON_FIRST} max-[389px]:hidden`}>
              <TrailIcon name="mail" />
              <span className="sr-only xl:not-sr-only">Email</span>
            </a>
          )}
          {phoneDisplay ? (
            <a href={getWhatsAppUrl("Hello! I would like to plan a trek in the Manaslu region.")} className={PLAN_BUTTON}>
              <WhatsAppLogo />
              Plan my trek
            </a>
          ) : (
            <Link href={`${ROUTES.contact}#${CONTACT_SECTIONS.plan}`} className={PLAN_BUTTON}>
              Plan my trek
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
