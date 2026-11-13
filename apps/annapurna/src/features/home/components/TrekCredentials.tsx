import { imageFileUrl } from "@ttn/site-data/images";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

/** Registration, licences and memberships from Site settings, with the certificate. Only what is typed in; nothing typed, no section. */
export const TrekCredentials = async () => {
  const { tourismRegistration, licence, panNumber, memberships, foundedYear, certificate } = await getSiteSettings();
  const facts = [
    { label: "Tourism registration", value: tourismRegistration },
    { label: "Tourism licence", value: licence },
    { label: "Tax number (PAN)", value: panNumber },
    { label: "Memberships", value: memberships.join(" · ") },
    { label: "Founded", value: foundedYear ? String(foundedYear) : "" },
  ].filter((fact) => fact.value);
  if (facts.length === 0 && !certificate) return null;

  return (
    <section aria-labelledby="credentials-h" id="credentials" className="flex flex-col gap-5">
      <SectionHeading id="credentials-h" eyebrow="Official verification" title="Licences and registration" />
      {facts.length > 0 && (
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-[14px] border border-solid border-line px-5 py-4">
              <dt className="text-eyebrow font-semibold tracking-[0.06em] text-muted uppercase">{fact.label}</dt>
              <dd className="leading-5.5 font-semibold break-words text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {certificate && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] bg-cloud p-4">
          <div className="flex items-center gap-3.5">
            <span className="relative h-16 w-20 flex-none overflow-hidden rounded-[10px] bg-sky">
              <SiteImage image={{ ...certificate, alt: "" }} sizes="80px" className="object-cover" />
            </span>
            <strong className="font-semibold text-ink">Registration certificate</strong>
          </div>
          <a href={imageFileUrl(certificate, 2000)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
            <TrailIcon name="doc" />
            View the certificate
          </a>
        </div>
      )}
    </section>
  );
};
