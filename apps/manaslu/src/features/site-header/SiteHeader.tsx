import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { whatsAppButton } from "@/components/ui/buttonStyles";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getHomeData } from "@/features/home/services/homeRepository";
import type { HomeTrekCard } from "@/features/home/types";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { formatDays, formatUsd } from "@/lib/format";
import { ROUTES, pagePath } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

import { MainTrekLink } from "./MainTrekLink";
import { NavDropdown } from "./NavDropdown";

const NAV_LINK = "inline-flex min-h-11 items-center whitespace-nowrap text-snow no-underline hover:text-saffron";

/** "12 days · Challenging · from $1,450": what's known of a trek, for the menu. */
const trekFacts = ({ days, difficulty, priceFromUsd }: HomeTrekCard) =>
  [days && formatDays(days), difficulty, priceFromUsd !== null && `from ${formatUsd(priceFromUsd)}`].filter(Boolean).join(" · ");

/** The dark bar at the top: the website's details (those filled in), the logo, the menu with the treks and blogs, and "Plan my trek". */
export const SiteHeader = async () => {
  const [{ phoneDisplay, email, licence }, { trek, otherTreks, guides }] = await Promise.all([getSiteSettings(), getHomeData()]);
  const hasTopLine = Boolean(phoneDisplay || email || licence);

  return (
    <header className="bg-forest-deep text-snow print:hidden">
      {hasTopLine && (
        <div className="border-b border-solid border-white/10 text-sm leading-5 text-on-forest-muted">
          <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 py-2">
            <span>{licence && `Licence ${licence}`}</span>
            <span className="flex flex-wrap gap-5">
              {phoneDisplay && (
                <a href={getWhatsAppUrl()} className="inline-flex min-h-6 items-center gap-1.5 text-snow no-underline hover:text-saffron">
                  <WhatsAppLogo size={14} />
                  {phoneDisplay}
                </a>
              )}
              {email && (
                <a href={getEmailUrl()} className="inline-flex min-h-6 items-center text-snow no-underline hover:text-saffron">
                  {email}
                </a>
              )}
            </span>
          </div>
        </div>
      )}
      <div className="wrap flex flex-wrap items-center justify-between gap-x-7 gap-y-2 py-3">
        <Link href={ROUTES.home} aria-label={`${SITE_NAME}, home`} className="inline-flex">
          <Image src="/brand/logo-header.png" alt={SITE_NAME} width={2586} height={1300} sizes="116px" preload className="h-14.5 w-auto" />
        </Link>
        <nav aria-label="Main" className="order-3 flex w-full flex-wrap items-center gap-x-6.5 font-medium lg:order-none lg:w-auto">
          {trek && <MainTrekLink name={trek.name} className={NAV_LINK} />}
          <NavDropdown
            label="Other treks"
            items={otherTreks.map((other) => ({ href: other.hasPage ? pagePath(other.slug) : "/#other-treks", title: other.name, text: trekFacts(other), image: other.image }))}
            more={trek ? { href: "/#compare", label: "Compare the treks" } : { href: "/#other-treks", label: "See the treks" }}
          />
          <NavDropdown
            label="Blogs"
            items={guides.map((guide) => ({ href: pagePath(guide.slug), title: guide.title, text: guide.tag, image: guide.image }))}
            more={{ href: ROUTES.travelGuides, label: "View all blogs" }}
          />
          <Link href={ROUTES.about} className={NAV_LINK}>
            About
          </Link>
          <Link href={ROUTES.contact} className={NAV_LINK}>
            Contact
          </Link>
        </nav>
        <a href={getWhatsAppUrl("Hello! I would like to plan a trek in the Manaslu region.")} className={`${whatsAppButton} min-h-11.5 rounded-full`}>
          <WhatsAppLogo />
          Plan my trek
        </a>
      </div>
    </header>
  );
};
