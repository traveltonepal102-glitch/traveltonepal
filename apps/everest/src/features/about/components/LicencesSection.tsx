import type { SiteImageSource } from "@ttn/site-data/images";
import { imageFileUrl } from "@ttn/site-data/images";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

import { ABOUT_SECTIONS } from "../sections";

const LEGAL_LINKS = [
  { label: "Impressum", href: ROUTES.impressum },
  { label: "AGB", href: ROUTES.terms },
  { label: "Datenschutzerklärung", href: ROUTES.privacy },
];

type CertificateProps = { image: SiteImageSource; title: string };

/** A scan that opens full size in a new tab. */
const Certificate = ({ image, title }: CertificateProps) => (
  <a href={imageFileUrl(image, 2000)} target="_blank" rel="noopener noreferrer" aria-label={`${title} öffnen (neuer Tab)`} className="flex flex-col gap-2 text-[15px] leading-5.5 font-semibold text-ink no-underline">
    <span className="relative block h-48 cursor-zoom-in overflow-hidden rounded-[10px] border border-solid border-line bg-ice">
      <span className="absolute inset-2">
        <SiteImage image={image} sizes="(min-width: 1024px) 240px, 50vw" className="object-contain" />
      </span>
    </span>
    {title}
  </a>
);

/** Licences from Site settings: the numbers, the scans and the legal pages. Blank ones are left out, and with nothing typed so is the section. */
export const LicencesSection = async ({ heading }: { heading: { title: string; text: string } }) => {
  const { legalName, tourismRegistration, licence, panNumber, staffInsurer, memberships, certificate, panCertificate } = await getSiteSettings();
  const fields = [
    { label: "Unternehmen", value: legalName },
    { label: "Registrierung bei der Tourismusbehörde", value: tourismRegistration },
    { label: "Tourismuslizenz", value: licence },
    { label: "Steuernummer (PAN)", value: panNumber },
    { label: "Versicherung der Mitarbeiter", value: staffInsurer },
    { label: "Mitgliedschaften", value: memberships.join(", ") },
  ].filter((field) => field.value);
  const certificates: CertificateProps[] = [
    ...(certificate ? [{ image: certificate, title: "Lizenz als Trekkingagentur" }] : []),
    ...(panCertificate ? [{ image: panCertificate, title: "PAN-Bescheinigung" }] : []),
  ];
  if (fields.length === 0 && certificates.length === 0) return null;

  return (
    <section id={ABOUT_SECTIONS.licences} aria-labelledby="licences-h" className="wrap flex flex-col gap-8 py-14 md:py-18">
      <SectionHeading id="licences-h" title={heading.title || "Registriert, lizenziert und versichert"}>
        <p className="max-w-[72ch]">{heading.text || "Jede der folgenden Nummern kannst du bei der Tourismusbehörde Nepal (Department of Tourism) überprüfen."}</p>
      </SectionHeading>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 rounded-2xl border border-solid border-line bg-snow p-6 shadow-card md:p-8">
          <dl className="flex flex-col divide-y divide-solid divide-line">
            {fields.map((field) => (
              <div key={field.label} className="grid gap-x-6 gap-y-0.5 py-3 first:pt-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <dt className="text-[15px] leading-6 text-muted">{field.label}</dt>
                <dd className="leading-6 font-semibold break-words text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 border-0 border-t border-solid border-line pt-4 text-[15px] font-semibold">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-6 items-center underline underline-offset-2">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {certificates.length > 0 && (
          <div className="grid gap-4.5 sm:grid-cols-2">
            {certificates.map((item) => (
              <Certificate key={item.title} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
