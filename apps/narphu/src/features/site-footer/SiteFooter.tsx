import Image from "next/image";
import Link from "next/link";

import { getHomeData } from "@/features/home/services/homeRepository";
import { NewsletterBox } from "@/features/newsletter/components/NewsletterBox";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES, pagePath } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

import { FooterContact } from "./FooterContact";
import { FOOTER_HEADING, FOOTER_LINK } from "./footerStyles";
import { MountainRidge } from "./MountainRidge";

type FooterColumn = { title: string; links: { label: string; href: string }[] };

const LEGAL_LINKS = [
  { label: "Terms", href: ROUTES.terms },
  { label: "Privacy", href: ROUTES.privacy },
  { label: "Impressum", href: ROUTES.impressum },
  { label: "Cookie settings", href: ROUTES.cookies },
];

/**
 * The footer (design: Footer): mountain ridges, then on the dark ink ground the logo, a line about the company and the
 * newsletter on the left; the treks, the latest blogs and the company's pages, the office, the ways to reach us and the
 * social links on the right; the legal line and links at the bottom. Details blank in Site settings are left out.
 */
export const SiteFooter = async () => {
  const [{ officeAddress, officeHours, email, phoneDisplay, legalName, licence, social, year }, { trekCard, otherTreks, latestGuides, reviews }] = await Promise.all([
    getSiteSettings(),
    getHomeData(),
  ]);
  const columns: FooterColumn[] = [
    { title: "Treks", links: [...(trekCard ? [trekCard] : []), ...otherTreks].filter((trek) => trek.hasPage).map((trek) => ({ label: trek.name, href: trek.href })) },
    { title: "Plan your trek", links: latestGuides.slice(0, 5).map((guide) => ({ label: guide.title, href: pagePath(guide.slug) })) },
    {
      title: "Company",
      links: [
        { label: "About us", href: ROUTES.about },
        ...(reviews.length > 0 ? [{ label: "Reviews", href: "/#reviews" }] : []),
        { label: "Blogs", href: ROUTES.blogs },
        { label: "Contact", href: ROUTES.contact },
      ],
    },
  ].filter((column) => column.links.length > 0);
  const legalLine = [`© ${year} ${legalName || SITE_NAME}`, licence && `Tourism licence ${licence}`].filter(Boolean).join(" · ");

  return (
    <footer className="text-base leading-6.5 text-on-maroon-muted print:hidden">
      <MountainRidge />
      <div className="bg-ink">
        <div className="wrap flex flex-wrap gap-14 pt-14">
          <div className="flex max-w-120 flex-[1_1_380px] flex-col gap-7">
            <Link href={ROUTES.home} aria-label={`${SITE_NAME}, home`} className="self-start">
              <Image src="/brand/logo-footer.png" alt={SITE_NAME} width={521} height={157} sizes="186px" className="h-14 w-auto" />
            </Link>
            <p>Private treks into the Nar Phu valley and over Kang La Pass, planned by a licensed local team in Kathmandu. Your dates, your pace, guides who know the valley&apos;s families by name.</p>
            <NewsletterBox />
          </div>

          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-10">
            <div className="grid gap-8 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
              {columns.map((column) => (
                <nav key={column.title} aria-label={column.title}>
                  <h2 className={FOOTER_HEADING}>{column.title}</h2>
                  <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
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
            </div>

            <div className="h-px bg-white/14" />

            <FooterContact officeAddress={officeAddress} officeHours={officeHours} email={email} phoneDisplay={phoneDisplay} social={social} />
          </div>
        </div>

        <div className="wrap pt-12 pb-8">
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 border-0 border-t border-solid border-white/14 pt-6 text-sm leading-5 text-on-ink-muted">
            <p>{legalLine}</p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1.5">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="inline-flex min-h-6 items-center text-on-ink-label no-underline hover:text-saffron">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
