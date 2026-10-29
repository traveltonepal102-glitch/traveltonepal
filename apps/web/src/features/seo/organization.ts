import type { SiteSettings } from "@/features/site-settings/types";
import { imageFileUrl } from "@/lib/images";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

/** The company's id in structured data, so every page's mentions of it are one and the same business. */
export const ORGANIZATION_ID = absoluteUrl("/#organization");

const LOGO_PATH = "/brand/logo-black.png";
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const time = ({ hour, minute }: { hour: number; minute: number }) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

/** "Thamel, Kathmandu, Nepal" → the street part before the city, when there is one. */
const streetOf = (address: string) => {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  const city = parts.findIndex((part) => /kathmandu/i.test(part));
  return city > 0 ? parts.slice(0, city).join(", ") : undefined;
};

/**
 * The company as Google's business details read it (TravelAgency), from Site settings: on every page, so search
 * results can show the name, contact details, opening hours and profiles. Blank details are left out.
 */
export const travelAgencyJsonLd = (settings: SiteSettings): JsonLdData => {
  const { contact, schedule, company, social, replyLanguages } = settings;
  const street = streetOf(contact.officeAddress);
  const image = settings.shareImage ? absoluteUrl(imageFileUrl(settings.shareImage, 1200)) : undefined;

  return {
    "@type": "TravelAgency",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    ...(company.legalName ? { legalName: company.legalName } : {}),
    url: absoluteUrl(ROUTES.home),
    logo: absoluteUrl(LOGO_PATH),
    ...(image ? { image } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phoneDisplay ? { telephone: contact.phoneDisplay } : {}),
    address: {
      "@type": "PostalAddress",
      ...(street ? { streetAddress: street } : {}),
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    ...(company.foundedYear ? { foundingDate: String(company.foundedYear) } : {}),
    ...(schedule.openDays.length
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: schedule.openDays.map((day) => WEEKDAYS[day]),
            opens: time(schedule.opens),
            closes: time(schedule.closes),
          },
        }
      : {}),
    ...(contact.phoneDisplay || contact.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(contact.phoneDisplay ? { telephone: contact.phoneDisplay } : {}),
            ...(contact.email ? { email: contact.email } : {}),
            ...(replyLanguages.length ? { availableLanguage: replyLanguages } : {}),
          },
        }
      : {}),
    hasMap: settings.officeMap.url,
    ...(social.length ? { sameAs: social.map((profile) => profile.url) } : {}),
  };
};
