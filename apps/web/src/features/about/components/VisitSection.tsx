import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { OfficeMapPreview } from "@/components/shared/OfficeMapPreview";
import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { googleMapsSearchUrl } from "@/lib/googleMaps/links";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/site";

import { SECTION, WRAP } from "./styles";

/** "Our office in Kathmandu": address, hours, phone and email, contact buttons and a link to the map. */
export const VisitSection = async () => {
  const { contact } = await getSiteSettings();
  const details: { icon: IconName; text: string }[] = [
    { icon: "location_on", text: contact.officeAddress },
    { icon: "schedule", text: contact.officeHours },
    { icon: "call", text: contact.phoneDisplay && `${contact.phoneDisplay} (WhatsApp)` },
    { icon: "mail", text: contact.email },
  ];

  return (
  <section id={ABOUT_SECTION_IDS.visit} aria-labelledby="about-visit-title" className={SECTION}>
    <div className={`${WRAP} grid gap-6 lg:grid-cols-2`}>
      <div className="flex flex-col justify-center gap-4">
        <PageSectionHeading
          id="about-visit-title"
          eyebrow="Visit us"
          title="Our office in Kathmandu"
          text="Come and meet the team before your trek. We do your gear check and trip briefing here."
        />
        <ul className="flex flex-col gap-2.5 text-[15px] text-ink">
          {details.filter((detail) => detail.text).map((detail) => (
            <li key={detail.icon} className="flex items-center gap-2.5 break-all sm:break-normal">
              <span aria-hidden="true" className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
                <Icon name={detail.icon} size={18} />
              </span>
              {detail.text}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <ButtonLink href={getWhatsAppUrl("Hello! I'd like to visit your office in Kathmandu.")} variant="whatsapp" icon="whatsapp" shape="rounded" isExternal>
            WhatsApp us
          </ButtonLink>
          <ButtonLink href={getEmailUrl({ subject: `Question for ${SITE_NAME}` })} variant="secondary" icon="mail" shape="rounded">
            Email us
          </ButtonLink>
        </div>
      </div>
      <OfficeMapPreview mapsUrl={googleMapsSearchUrl(`${SITE_NAME}, ${contact.officeAddress}`)} />
    </div>
  </section>
);
};
