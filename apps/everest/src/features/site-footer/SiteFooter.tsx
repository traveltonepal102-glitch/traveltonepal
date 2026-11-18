import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import Image from "next/image";
import Link from "next/link";

import { SocialIcon } from "@/components/ui/SocialIcon";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getHomeData } from "@/features/home/services/homeRepository";
import { NewsletterBox } from "@/features/newsletter/components/NewsletterBox";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES, pagePath } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

import { FooterContact } from "./FooterContact";
import { FooterContours } from "./FooterContours";
import { FOOTER_HEADING, FOOTER_LINK } from "./footerStyles";

/** `isWide`: long link titles (blogs) take the full width on a phone, where short ones sit two side by side. */
type FooterColumn = { title: string; links: { label: string; href: string }[]; isWide?: boolean };

const LEGAL_LINKS = [
  { label: "Impressum", href: ROUTES.impressum },
  { label: "Datenschutz", href: ROUTES.privacy },
  { label: "AGB", href: ROUTES.terms },
  { label: "Cookie-Einstellungen", href: ROUTES.cookies },
];

const CTA_BUTTON = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-bold no-underline";

/**
 * The footer (design: canvas "Everest Trek Website", Footer; decided 2026-11-18: its own, not Nar Phu's ridges): on
 * Ocean 950 with the brand's contour lines, a call to plan the trek beside the newsletter; then the brand (logo on its
 * white plate, a line about the company, the licence and the social links), the treks, the latest blogs, the pages and
 * the ways to reach us; a large outlined "Everest Trek" and the legal line at the foot. Details blank in Site settings
 * are left out.
 */
export const SiteFooter = async () => {
  const [{ officeAddress, officeHours, email, phoneDisplay, legalName, licence, social, year }, { trekCard, otherTreks, latestGuides, reviews }] = await Promise.all([
    getSiteSettings(),
    getHomeData(),
  ]);
  const columns: FooterColumn[] = [
    { title: "Treks", links: [...(trekCard ? [trekCard] : []), ...otherTreks].filter((trek) => trek.hasPage).map((trek) => ({ label: trek.name, href: trek.href })) },
    {
      title: "Everest Trek",
      links: [
        { label: "Über uns", href: ROUTES.about },
        ...(reviews.length > 0 ? [{ label: "Bewertungen", href: "/#reviews" }] : []),
        { label: "Blog", href: ROUTES.blogs },
        { label: "Kontakt", href: ROUTES.contact },
      ],
    },
    { title: "Ratgeber", links: latestGuides.slice(0, 4).map((guide) => ({ label: guide.title, href: pagePath(guide.slug) })), isWide: true },
  ].filter((column) => column.links.length > 0);

  return (
    <footer className="relative isolate overflow-hidden bg-night text-on-ocean-muted print:hidden">
      <FooterContours />

      <div className="wrap grid gap-10 border-0 border-b border-solid border-white/12 pt-16 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-4">
          <span className="eyebrow eyebrow-dash text-on-ink-label">Bereit für den Khumbu?</span>
          <p className="m-0 max-w-140 font-display text-[clamp(30px,2.4vw+20px,44px)] leading-[1.08] font-extrabold tracking-[-0.02em] text-snow">Plane deinen Trek direkt mit unserem Team in Kathmandu.</p>
          <div className="actions pt-2">
            {phoneDisplay && (
              <a href={getWhatsAppUrl("Hallo! Ich möchte einen Trek in der Everest-Region planen.")} target="_blank" rel="nofollow noopener" className={`${CTA_BUTTON} bg-whatsapp text-snow hover:bg-whatsapp-deep hover:text-snow`}>
                <WhatsAppLogo />
                Trek planen
              </a>
            )}
            {email && (
              <a href={getEmailUrl({ subject: `Trekplanung mit ${SITE_NAME}` })} rel="nofollow" className={`${CTA_BUTTON} border-[1.5px] border-solid border-white/40 text-snow hover:bg-white/10 hover:text-snow`}>
                <TrailIcon name="mail" />
                E-Mail schreiben
              </a>
            )}
          </div>
        </div>
        <div className="rounded-3xl bg-white/5 backdrop-blur-sm empty:hidden">
          <NewsletterBox />
        </div>
      </div>

      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:gap-8">
        <div className="col-span-2 flex flex-col gap-5 lg:col-span-1">
          <Link href={ROUTES.home} aria-label={`${SITE_NAME}, Startseite`} className="self-start rounded-2xl bg-snow px-4 py-2.5">
            <Image src="/brand/logo-footer.png" alt={SITE_NAME} width={415} height={156} sizes="160px" className="h-14 w-auto" />
          </Link>
          <p className="m-0 max-w-90 text-[15px] leading-6.5">Private Treks zum Everest Base Camp, zu den Gokyo-Seen und auf den Pikey Peak. Dein Termin, dein Tempo, Sherpa-Guides, die im Khumbu zu Hause sind.</p>
          {licence && (
            <p className="m-0 inline-flex items-center gap-2 self-start rounded-full border border-solid border-white/15 px-3.5 py-1.5 text-[13px] font-semibold text-on-ocean-muted">
              <TrailIcon name="shield" size={15} className="text-glacier" />
              Lizenzierte Agentur in Kathmandu
            </p>
          )}
          {social.length > 0 && (
            <ul aria-label="Folge uns" className="m-0 flex list-none flex-wrap gap-2 p-0">
              {social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="inline-flex size-11 items-center justify-center rounded-xl border border-solid border-white/15 bg-white/5 text-on-ocean-muted hover:border-glacier hover:text-snow"
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className={column.isWide ? "col-span-2 sm:col-span-1" : undefined}>
            <h2 className={FOOTER_HEADING}>{column.title}</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <FooterContact officeAddress={officeAddress} officeHours={officeHours} email={email} phoneDisplay={phoneDisplay} />
      </div>

      {/* The brand's name written large and outlined: decoration, the logo above says it. */}
      <p aria-hidden="true" className="wrap m-0 max-w-none overflow-hidden font-display text-[clamp(32px,11.2vw,168px)] leading-[0.82] font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1.5px_rgb(141_169_196/0.35)]">
        EVEREST TREK
      </p>

      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-0 border-t border-solid border-white/12 py-6 text-sm leading-5 text-on-ink-muted">
        <p className="m-0">
          © {year} {legalName || SITE_NAME}
          {licence && ` · Lizenz-Nr. ${licence}`}
        </p>
        <nav aria-label="Rechtliches" className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center text-on-ink-label no-underline hover:text-snow">
              {link.label}
            </Link>
          ))}
          <a href="#top" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-snow no-underline hover:text-glacier">
            Nach oben
            <TrailIcon name="chevron" size={14} className="rotate-180" />
          </a>
        </nav>
      </div>
    </footer>
  );
};
