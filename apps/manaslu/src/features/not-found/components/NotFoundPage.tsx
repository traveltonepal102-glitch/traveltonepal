import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { outlineButton, primaryButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getHomeData } from "@/features/home/services/homeRepository";
import { trekFacts } from "@/features/home/trekFacts";
import type { HomeTrekCard } from "@/features/home/types";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

const TrekLink = ({ trek }: { trek: HomeTrekCard }) => (
  <Link href={trek.href} className="flex items-center gap-4 rounded-2xl border border-solid border-line bg-snow p-3 text-text no-underline shadow-card hover:border-forest">
    <span className="relative block aspect-4/3 w-24 flex-none overflow-hidden rounded-[10px] bg-forest-tint sm:w-32">
      {trek.image && <SiteImage image={{ ...trek.image, alt: "" }} sizes="128px" className="object-cover" />}
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="font-display text-xl leading-6.5 font-semibold text-ink">{trek.name}</span>
      <span className="text-[15px] leading-5.5 text-muted">{trekFacts(trek)}</span>
    </span>
    <TrailIcon name="arrow" size={18} className="mr-2 ml-auto flex-none text-forest max-sm:hidden" />
  </Link>
);

/** A page that doesn't exist: what happened, the way home, the website's treks and how to ask. Details left blank in Site settings are left out. */
export const NotFoundPage = async () => {
  const [{ trekCard, otherTreks }, { phoneDisplay, email }] = await Promise.all([getHomeData(), getSiteSettings()]);
  const treks = [...(trekCard ? [trekCard] : []), ...otherTreks].filter((trek) => trek.hasPage);
  const canAsk = Boolean(phoneDisplay || email);

  return (
    <main id="main">
      <div className="border-0 border-b border-solid border-line bg-stone">
        <div className="wrap flex flex-col items-start gap-4 py-14 md:py-20">
          <span className="eyebrow">Error 404</span>
          <h1>We can’t find that page</h1>
          <p className="max-w-[62ch] text-[19px] leading-7.5">The address may be mistyped, or the page may have moved. Everything else on the website is still here.</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href={ROUTES.home} className={primaryButton}>
              Back to the home page
            </Link>
            <Link href={ROUTES.contact} className={outlineButton}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
      {(treks.length > 0 || canAsk) && (
        <div className={`wrap grid items-start gap-8 py-14 md:py-18 ${treks.length > 0 && canAsk ? "lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]" : ""}`}>
          {treks.length > 0 && (
            <section aria-labelledby="not-found-treks-h" className="flex flex-col gap-6">
              <SectionHeading id="not-found-treks-h" title="Looking for a trek?" />
              <ul className="flex flex-col gap-3">
                {treks.map((trek) => (
                  <li key={trek.slug}>
                    <TrekLink trek={trek} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {canAsk && (
            <section aria-labelledby="not-found-ask-h" className="flex flex-col gap-3 rounded-2xl bg-stone p-6 md:p-8">
              <h2 id="not-found-ask-h" className="text-[28px]! leading-9!">
                Ask our team
              </h2>
              <p className="text-base leading-6.5">Tell us what you were looking for and we will send you the right link.</p>
              <div className="mt-2 flex flex-col gap-2.5">
                {phoneDisplay && (
                  <a href={getWhatsAppUrl("Hello! I was looking for a page on your website and could not find it.")} className={whatsAppButton}>
                    <WhatsAppLogo />
                    Ask on WhatsApp
                  </a>
                )}
                {email && (
                  <a href={getEmailUrl({ subject: "A page I could not find on your website" })} className={`${outlineButton} bg-snow!`}>
                    <TrailIcon name="mail" />
                    Email us
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
};
