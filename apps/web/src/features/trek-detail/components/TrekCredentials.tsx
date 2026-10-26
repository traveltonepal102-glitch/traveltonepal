
import { Icon } from "@ttn/ui/icon";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { imageFileUrl } from "@/lib/images";
import { SiteImage } from "@/components/ui/SiteImage";
import { credentialsFor } from "@/features/about/credentials";
import type { CredentialTone } from "@/features/about/credentials";

import { TREK_SECTION_IDS } from "../sections";
import { CARD_TITLE, PANEL } from "./styles";

const VALUE_TONES: Record<CredentialTone, string> = { green: "text-whatsapp", brand: "text-brand", ink: "text-ink" };
const BOX = "rounded-md border border-line bg-page";

/** "Official verification": registration, licences and memberships, with the registration certificate. */
export const TrekCredentials = async () => {
  const settings = await getSiteSettings();
  const { foundedYear, facts, certificate } = credentialsFor(settings);
  const registration = settings.company.tourismRegistration;

  return (
    <section
      id={TREK_SECTION_IDS.credentials}
      aria-labelledby="trek-credentials-title"
      className={`${PANEL} flex scroll-mt-16 flex-col gap-4 p-4.5 md:p-6`}
    >
      <div className="flex flex-col gap-2 border-b border-line pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-eyebrow text-whatsapp uppercase">Official verification</p>
          <h2 id="trek-credentials-title" className={CARD_TITLE}>
            Credentials and government licences
          </h2>
        </div>
        <p className="flex-none text-[11px] font-semibold text-muted-foreground uppercase">{foundedYear ? `Est. ${foundedYear} · Kathmandu` : "Kathmandu"}</p>
      </div>

      {facts.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className={`${BOX} p-3`}>
              <dt className="text-[10px] font-bold text-muted-foreground uppercase">{fact.label}</dt>
              <dd className={`mt-0.5 font-display text-body-sm font-bold break-words ${VALUE_TONES[fact.tone]}`}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className={`${BOX} mt-1 flex flex-col gap-3.5 rounded-xl p-3.5 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-3.5">
          <span className="relative inline-flex h-16 w-20 flex-none items-center justify-center overflow-hidden rounded-md border border-line-strong bg-surface text-subtle">
            {certificate.image ? (
              <SiteImage image={{ ...certificate.image, alt: "" }} sizes="80px" className="object-cover" />
            ) : (
              <Icon name="description" size={22} />
            )}
          </span>
          <p className="flex flex-col">
            <strong className="inline-flex items-center gap-1.5 font-display text-body-sm font-bold text-ink">
              <Icon name="verified" size={16} className="flex-none text-whatsapp" />
              {certificate.title}
            </strong>
            <span className="text-[11px] text-muted-foreground">
              {registration ? `Registration ${registration} · licensed trekking agency` : "Licensed trekking agency"}
            </span>
          </p>
        </div>
        {certificate.image && (
          <a
            href={imageFileUrl(certificate.image, 2000)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-none items-center justify-center gap-1.5 rounded-md border border-brand/15 bg-surface px-3.5 py-2.25 text-xs font-bold text-brand hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Icon name="description" size={16} />
            View full certificate
          </a>
        )}
      </div>
    </section>
  );
};
