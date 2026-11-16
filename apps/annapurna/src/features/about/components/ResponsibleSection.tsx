import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";

import { ABOUT_SECTIONS } from "../sections";

/** Company practice that rarely changes (the rest of the page is in Pages › About). */
const PRACTICES: readonly { title: string; points: readonly string[] }[] = [
  { title: "Fair zu Trägern", points: ["Gewichtsgrenze für jede Last", "Warme Kleidung und gute Schuhe", "Versicherung und faire Bezahlung"] },
  { title: "Das Geld bleibt vor Ort", points: ["Einheimische Guides aus jedem Tal", "Familiengeführte Teehäuser", "Mahlzeiten unterwegs gekauft"] },
  { title: "Keine Spuren hinterlassen", points: ["Keine Einweg-Plastikflaschen", "Jeder Müll wird mitgenommen", "Auf markierten Wegen bleiben"] },
  { title: "Respekt vor der Kultur", points: ["Einweisung in Sitten und Bräuche vorab", "Angemessene Kleidung bei Klöstern", "Vor dem Fotografieren fragen"] },
];

/** "Good for the people and places you visit": four practices with their checklists. */
export const ResponsibleSection = () => (
  <section id={ABOUT_SECTIONS.responsible} aria-labelledby="responsible-h" className="bg-cloud py-14 md:py-18">
    <div className="wrap flex flex-col gap-8">
      <SectionHeading id="responsible-h" title="Gut für die Menschen und Orte, die Sie besuchen">
        <p className="max-w-[72ch]">Vom Trekking leben viele Bergfamilien. Wir sorgen dafür, dass Geld und Respekt dort ankommen, wo sie hingehören.</p>
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
