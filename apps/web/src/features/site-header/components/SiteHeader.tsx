import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import { listRegions } from "@/features/regions/services/regionsRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { ROUTES } from "@/lib/routes";

import { ABOUT_LINKS, GUIDE_LINKS, NAV_TABS, regionLinks, trekColumns, treksMenuNote } from "../navigation";
import { HeaderMenuProvider } from "./HeaderMenuProvider";
import type { HeaderVariant } from "./HeaderMenuProvider";
import { MenuPanel } from "./MenuPanel";
import { MenuTab } from "./MenuTab";
import { MobileMenuButton, MobileMenuPanel } from "./MobileMenu";
import { MobileMenuContent } from "./MobileMenuContent";
import { NavTabLink } from "./NavTabLink";
import { RegionsMenu } from "./RegionsMenu";
import { TopicsMenu } from "./TopicsMenu";
import { TreksMenu } from "./TreksMenu";
import { UtilityBar } from "./UtilityBar";

type SiteHeaderProps = {
  /** "overlay" sits on the home page's hero photo; "solid" is every other page. */
  variant?: HeaderVariant;
};

/**
 * Shared website header (design: Header.dc.html): utility bar, main bar, dropdown menus. The Treks and Regions
 * menus come from the database (the same cached reads as the home page).
 */
export const SiteHeader = async ({ variant = "solid" }: SiteHeaderProps) => {
  const isOverlay = variant === "overlay";
  const [regions, treks] = await Promise.all([listRegions(), listTreks()]);

  return (
    <HeaderMenuProvider variant={variant}>
      <UtilityBar variant={variant} />
      <header className={isOverlay ? "bg-transparent" : "border-b border-line bg-surface shadow-card"}>
        <div className="mx-auto flex h-19 max-w-content items-center justify-between gap-5 px-4 md:px-6">
          <Link
            href={ROUTES.home}
            className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Image
              src={isOverlay ? "/brand/logo-white.svg" : "/brand/logo.svg"}
              alt="Travel To Nepal"
              width={isOverlay ? 91 : 89}
              height={52}
              preload
              className="h-11 w-auto md:h-13"
            />
          </Link>

          <nav aria-label="Main" className="hidden h-full items-center gap-1.5 lg:flex">
            {NAV_TABS.map((tab) =>
              tab.hasMenu ? (
                <MenuTab
                  key={tab.key}
                  menu={tab.key}
                  label={tab.label}
                  section={tab.href}
                  chevron={<Icon name="keyboard_arrow_down" size={18} />}
                />
              ) : (
                <NavTabLink key={tab.key} label={tab.label} href={tab.href} />
              ),
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11.5 items-center gap-2 rounded-full px-4.5 text-body font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isOverlay
                  ? "bg-white text-brand hover:bg-brand-tint focus-visible:outline-white"
                  : "bg-brand text-on-brand shadow-card hover:bg-brand-hover focus-visible:outline-ring"
              }`}
            >
              <Icon name="chat" className={isOverlay ? "text-whatsapp" : undefined} />
              <span className="max-md:sr-only">Plan my trek</span>
              <span className="sr-only"> on WhatsApp</span>
            </a>
            <MobileMenuButton openIcon={<Icon name="menu" size={22} />} closeIcon={<Icon name="close" size={22} />} />
          </div>
        </div>
      </header>

      <MenuPanel menu="treks">
        <TreksMenu columns={trekColumns(treks)} note={treksMenuNote(treks.length, regions.length)} />
      </MenuPanel>
      <MenuPanel menu="regions">
        <RegionsMenu links={regionLinks(regions)} />
      </MenuPanel>
      <MenuPanel menu="guides">
        <TopicsMenu links={GUIDE_LINKS} allLabel="All travel guides" allHref={ROUTES.guides} align="center" />
      </MenuPanel>
      <MenuPanel menu="about">
        <TopicsMenu links={ABOUT_LINKS} allLabel="More about us" allHref={ROUTES.about} align="end" />
      </MenuPanel>
      <MobileMenuPanel>
        <MobileMenuContent />
      </MobileMenuPanel>
    </HeaderMenuProvider>
  );
};
