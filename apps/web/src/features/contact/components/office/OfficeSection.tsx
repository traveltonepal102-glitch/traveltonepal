import { OfficeMap } from "@/components/shared/OfficeMap";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { officeHoursAbroad } from "../../officeHours";
import { CONTACT_SECTION_IDS } from "../../sections";
import type { ContactPageContent } from "../../types";
import { WRAP } from "../styles";
import { OfficeDetails } from "./OfficeDetails";
import { TimeDifference } from "./TimeDifference";

/** Office map beside the office details and the time difference (for the places picked in Pages › Contact). */
export const OfficeSection = async ({ page }: { page: Pick<ContactPageContent, "officeDirections" | "timeZones" | "timeNote"> }) => {
  const { officeMap, schedule } = await getSiteSettings();
  return (
    <section id={CONTACT_SECTION_IDS.office} aria-labelledby="contact-office-title" className="scroll-mt-4 py-12">
      <h2 id="contact-office-title" className="sr-only">
        Our office in Kathmandu
      </h2>
      <div className={`${WRAP} grid gap-6 lg:grid-cols-2`}>
        <OfficeMap mapsUrl={officeMap.url} embedUrl={officeMap.embedUrl} className="min-h-95" />
        <div className="flex flex-col gap-4">
          <OfficeDetails directions={page.officeDirections} />
          {page.timeZones.length > 0 && <TimeDifference rows={officeHoursAbroad(schedule, page.timeZones)} note={page.timeNote} />}
        </div>
      </div>
    </section>
  );
};
