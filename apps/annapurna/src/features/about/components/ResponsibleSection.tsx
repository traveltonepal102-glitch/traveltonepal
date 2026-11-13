import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";

import { ABOUT_SECTIONS } from "../sections";

/** Company practice that rarely changes (the rest of the page is in Pages › About). */
const PRACTICES: readonly { title: string; points: readonly string[] }[] = [
  { title: "Fair to porters", points: ["Weight limits on every load", "Warm gear and proper boots", "Insurance and fair pay"] },
  { title: "Money stays local", points: ["Local guides from each valley", "Family-run teahouses", "Meals bought on the trail"] },
  { title: "Leave no trace", points: ["No single-use plastic bottles", "All rubbish carried out", "Stay on marked trails"] },
  { title: "Respect local culture", points: ["Briefing on customs before you go", "Dress well near monasteries", "Ask before taking photos"] },
];

/** "Good for the people and places you visit": four practices with their checklists. */
export const ResponsibleSection = () => (
  <section id={ABOUT_SECTIONS.responsible} aria-labelledby="responsible-h" className="bg-cloud py-14 md:py-18">
    <div className="wrap flex flex-col gap-8">
      <SectionHeading id="responsible-h" title="Good for the people and places you visit">
        <p className="max-w-[72ch]">Trekking keeps many mountain families going. We make sure the money and the respect go where they should.</p>
      </SectionHeading>
      <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {PRACTICES.map((practice) => (
          <li key={practice.title} className="flex flex-col gap-3 rounded-2xl border border-solid border-line bg-snow p-6">
            <h3 className="text-xl! leading-6.5!">{practice.title}</h3>
            <ul className="flex flex-col gap-2 text-[15px] leading-5.5">
              {practice.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <TrailIcon name="check" size={18} className="mt-0.5 text-navy" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
