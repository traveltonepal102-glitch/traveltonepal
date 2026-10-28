import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import type { SiteImageSource } from "@/lib/images";
import { imageFileUrl } from "@/lib/images";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";
import { ROUTES } from "@/lib/routes";

import { licencesFor } from "../credentials";
import type { SectionHeading } from "../types";
import { FOCUS, SECTION, WRAP } from "./styles";

const CARD = "rounded-2xl border border-line bg-surface p-4.5 md:p-6";

const LEGAL_LINKS = [
  { label: "Impressum", href: ROUTES.impressum },
  { label: "Terms and booking conditions", href: ROUTES.terms },
  { label: "Privacy policy", href: ROUTES.privacy },
] as const;

type CertificateProps = { image: SiteImageSource; title: string; detail: string };

/** A certificate scan that opens full size (in a new tab), with its name under it. */
const Certificate = ({ image, title, detail }: CertificateProps) => (
  <figure className="flex flex-col gap-2">
    <a
      href={imageFileUrl(image, 2000)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Enlarge the ${title.toLowerCase()} (opens in a new tab)`}
      className={`relative block h-65 cursor-zoom-in rounded-xl border border-line bg-muted ${FOCUS}`}
    >
      <span className="absolute inset-2.5">
        <SiteImage image={image} sizes="(min-width: 1024px) 280px, 50vw" className="object-contain" />
      </span>
      <span aria-hidden="true" className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-navy/85 px-2 py-1 text-[11px] font-bold text-white">
        <Icon name="zoom_in" size={12} />
        Enlarge
      </span>
    </a>
    <figcaption className="flex flex-col gap-0.5">
      <span className="font-display text-[15px] leading-5 font-bold text-ink">{title}</span>
      {detail && <span className="text-xs leading-[18px] text-muted-foreground">{detail}</span>}
    </figcaption>
  </figure>
);

/** "Licences and legal" (design: About.dc.html): every registration number, the two certificates and the legal pages (all from Site settings). */
export const LicencesSection = async ({ heading }: { heading: SectionHeading }) => {
  const settings = await getSiteSettings();
  const { company } = settings;
  const licences = licencesFor(settings);
  const certificates: CertificateProps[] = [
    ...(company.certificate
      ? [
          {
            image: company.certificate,
            title: "Trekking agency licence",
            detail: [company.tourismLicence && `No. ${company.tourismLicence}`, "Nepal Department of Tourism"].filter(Boolean).join(" · "),
          },
        ]
      : []),
    ...(company.panCertificate ? [{ image: company.panCertificate, title: "PAN registration certificate", detail: "Inland Revenue Department, Nepal" }] : []),
  ];

  return (
    <section id={ABOUT_SECTION_IDS.licences} aria-labelledby="about-licences-title" className={SECTION}>
      <div className={`${WRAP} flex flex-col gap-7`}>
        <PageSectionHeading
          id="about-licences-title"
          tone="green"
          eyebrow="Licences and legal"
          title={heading.title || "Registered, licensed and insured"}
          text={heading.text || "You can check every number below with the Nepal Department of Tourism and TAAN."}
        />
        <div className="flex flex-wrap gap-6">
          <dl className={`${CARD} grid min-w-0 flex-[1_1_480px] content-start gap-3 sm:grid-cols-2`}>
            {licences.map((licence) => (
              <div key={licence.label} className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3.5">
                <Icon name={licence.icon} size={20} className="flex-none text-whatsapp" />
                <div className="flex flex-col-reverse leading-snug">
                  <dt className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">{licence.label}</dt>
                  <dd className="font-display text-base font-bold text-ink">{licence.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className={`${CARD} flex min-w-0 flex-[1_1_420px] flex-col gap-3.5`}>
            {certificates.length > 0 ? (
              <div className="grid gap-3.5 sm:grid-cols-2">
                {certificates.map((certificate) => (
                  <Certificate key={certificate.title} {...certificate} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-50 items-center justify-center rounded-xl border border-dashed border-line-strong bg-page">
                <Icon name="verified" size={40} className="text-whatsapp" />
              </div>
            )}
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-3 text-[13px] font-semibold">
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
