import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import type { SitePageTop } from "@/features/site-pages/types";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

import { OfficeStatusBadge } from "./OfficeStatusBadge";
import { WRAP } from "./styles";

/**
 * Photo hero: breadcrumb, office status (its green line), title and intro (Pages › Contact). Extra space at the bottom for the
 * contact cards to overlap.
 */
export const ContactHero = async ({ top }: { top: SitePageTop }) => {
  const { schedule } = await getSiteSettings();
  return (
  <section aria-labelledby="contact-title" className="relative overflow-hidden bg-navy text-white">
    {/* Decorative: the title says what the page is. */}
    <SiteImage image={top.cover ? { ...top.cover, alt: "" } : { src: "/images/langtang-khola-river.jpg", alt: "" }} priority sizes="100vw" className="object-cover" />
    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-navy/96 via-navy/80 via-55% to-navy/40" />

    <div className={`${WRAP} relative flex flex-col gap-4 pt-5.5 pb-24`}>
      <Breadcrumbs tone="onDark" items={[{ label: "Home", href: ROUTES.home }, { label: "Contact" }]} />
      <OfficeStatusBadge schedule={schedule} openText={top.eyebrow} />
      <h1 id="contact-title" className="max-w-190 text-h1-sm tracking-tight text-white md:text-h1">
        {top.heading}
      </h1>
      {top.intro && <p className="max-w-155 text-body-lg text-white/85">{top.intro}</p>}
    </div>
  </section>
);
};
