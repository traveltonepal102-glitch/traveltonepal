
import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { imageFileUrl } from "@/lib/images";
import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";
import { ROUTES } from "@/lib/routes";

import { credentialsFor, licencesFor } from "../credentials";
import type { SectionHeading } from "../types";
import { FOCUS, SECTION, WRAP } from "./styles";

const CARD = "rounded-2xl border border-line bg-surface p-4.5 md:p-5.5";

const LEGAL_LINKS = [
  { label: "Impressum", href: ROUTES.impressum },
  { label: "Terms and booking conditions", href: ROUTES.terms },
  { label: "Privacy policy", href: ROUTES.privacy },
] as const;

/** "Licences and legal": every registration number, the licence certificate and the legal pages (numbers from Site settings). */
export const LicencesSection = async ({ heading }: { heading: SectionHeading }) => {
  const settings = await getSiteSettings();
  const { certificate } = credentialsFor(settings);
  const licences = licencesFor(settings);
  const registration = settings.company.tourismRegistration;

  return (
    <section id={ABOUT_SECTION_IDS.licences} aria-labelledby="about-licences-title" className={SECTION}>
      <div className={`${WRAP} flex flex-col gap-5.5`}>
        <PageSectionHeading
          id="about-licences-title"
          tone="green"
          eyebrow="Licences and legal"
          title={heading.title || "Registered, licensed and insured"}
          text={heading.text || "You can check every number below with the Nepal Department of Tourism and TAAN."}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <dl className={`${CARD} grid content-start gap-2.5 sm:grid-cols-2`}>
            {licences.map((licence) => (
              <div key={licence.label} className="flex items-center gap-2.5 rounded-xl border border-muted bg-page p-3">
                <span aria-hidden="true" className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-green-tint text-whatsapp">
                  <Icon name={licence.icon} size={20} />
                </span>
                <div className="flex flex-col leading-snug">
                  <dt className="text-[11px] font-bold tracking-[0.05em] text-muted-foreground uppercase">{licence.label}</dt>
                  <dd className="font-display text-[15px] font-bold text-ink">{licence.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className={`${CARD} flex flex-col gap-3.5`}>
            <div className="relative flex min-h-50 flex-1 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-dashed border-line-strong bg-page text-caption font-normal text-subtle">
              {certificate.image ? (
                <SiteImage image={certificate.image} sizes="(min-width: 1024px) 560px, 100vw" className="object-contain" />
              ) : (
                <Icon name="verified" size={40} className="text-whatsapp" />
              )}
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex flex-col leading-snug">
                <span className="font-bold text-ink">Trekking agency licence</span>
                <span className="text-xs text-muted-foreground">{registration ? `Nepal Department of Tourism · Reg. ${registration}` : "Nepal Department of Tourism"}</span>
              </p>
              {certificate.image && (
                <a
                  href={imageFileUrl(certificate.image, 2000)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-10 flex-none items-center justify-center gap-1.5 rounded-md border border-[#d3e3f1] bg-surface px-3.5 font-bold text-brand hover:bg-brand-tint ${FOCUS}`}
                >
                  <Icon name="description" size={16} />
                  View full size
                </a>
              )}
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-muted pt-3 text-caption font-semibold">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`rounded-sm text-brand hover:underline ${FOCUS}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
