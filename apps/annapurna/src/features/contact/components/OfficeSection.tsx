import { officeHoursAbroad } from "@ttn/site-data/officeHours";

import { OfficeMap } from "@/components/shared/OfficeMap";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { SITE_NAME } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

import { CONTACT_SECTIONS } from "../sections";
import type { ContactPageContent } from "../types";

type OfficeSectionProps = { page: Pick<ContactPageContent, "officeDirections" | "timeZones" | "timeNote"> };

/** Where we are, and our hours in the visitor's own time (the places picked in Pages › Contact). */
export const OfficeSection = async ({ page }: OfficeSectionProps) => {
  const { officeAddress, officeMap, schedule, googleWriteUrl } = await getSiteSettings();
  const times = officeHoursAbroad(schedule, page.timeZones);

  return (
    <section id={CONTACT_SECTIONS.office} aria-labelledby="contact-office-h" className="bg-cloud py-14 md:py-18">
      <div className="wrap flex flex-col gap-8">
        <SectionHeading id="contact-office-h" title="Find us">
          {officeAddress && <p>{[officeAddress, page.officeDirections].filter(Boolean).join(". ")}</p>}
        </SectionHeading>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <OfficeMap mapsUrl={officeMap.url} embedUrl={officeMap.embedUrl} label={`${SITE_NAME} office`} />
          <div className="flex flex-col gap-4">
            {times.length > 0 && (
              <div className="flex flex-col gap-3 rounded-2xl border border-solid border-line bg-snow p-6">
                <h3 className="text-xl! leading-6.5!">Our office hours in your time</h3>
                <p className="text-[15px] leading-5.75">Nepal time is UTC+5:45.</p>
                <table className="w-full border-collapse text-[15px] leading-5.5">
                  <thead>
                    <tr className="text-left">
                      <th scope="col" className="py-2 pr-3 font-semibold text-muted">
                        City
                      </th>
                      <th scope="col" className="py-2 pr-3 font-semibold text-muted">
                        Summer
                      </th>
                      <th scope="col" className="py-2 font-semibold text-muted">
                        Winter
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {times.map((time) => (
                      <tr key={time.place} className="border-0 border-t border-solid border-line">
                        <th scope="row" className="py-2 pr-3 text-left font-semibold text-ink">
                          {time.place}
                        </th>
                        <td className="py-2 pr-3 whitespace-nowrap">{time.summer}</td>
                        <td className="py-2 whitespace-nowrap">{time.winter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-sm leading-5 text-muted">{page.timeNote || "Outside these hours? Leave a WhatsApp message. We reply first thing in the morning."}</p>
              </div>
            )}
            {googleWriteUrl && (
              <p className="text-[15px] leading-5.75">
                Trekked with us?{" "}
                <a href={ROUTES.review} className="font-semibold underline underline-offset-2">
                  Write a review on Google
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
