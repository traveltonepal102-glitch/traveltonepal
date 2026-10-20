import { CONTACT } from "@ttn/config/contact";

import { OfficeMapPreview } from "@/components/shared/OfficeMapPreview";
import { googleMapsSearchUrl } from "@/lib/googleMaps/links";
import { SITE_NAME } from "@/lib/site";

import { officeHoursAbroad } from "../../officeHours";
import { CONTACT_SECTION_IDS } from "../../sections";
import { WRAP } from "../styles";
import { OfficeDetails } from "./OfficeDetails";
import { TimeDifference } from "./TimeDifference";

/** Office map beside the office details and the time difference. */
export const OfficeSection = () => (
  <section id={CONTACT_SECTION_IDS.office} aria-labelledby="contact-office-title" className="scroll-mt-4 py-12">
    <h2 id="contact-office-title" className="sr-only">
      Our office in Kathmandu
    </h2>
    <div className={`${WRAP} grid gap-6 lg:grid-cols-2`}>
      <OfficeMapPreview mapsUrl={googleMapsSearchUrl(`${SITE_NAME}, ${CONTACT.officeAddress}`)} className="min-h-95" />
      <div className="flex flex-col gap-4">
        <OfficeDetails />
        <TimeDifference rows={officeHoursAbroad()} />
      </div>
    </div>
  </section>
);
