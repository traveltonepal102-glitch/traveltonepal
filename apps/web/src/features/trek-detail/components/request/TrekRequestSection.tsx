import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { EYEBROW, PANEL } from "../styles";
import { TrekRequestForm } from "./TrekRequestForm";

type TrekRequestSectionProps = Pick<TrekDetail, "name" | "days" | "groupPrices">;

/** "Book your … trek": the inquiry form that "Book this trek / Inquire now" jumps to. */
export const TrekRequestSection = ({ name, days, groupPrices }: TrekRequestSectionProps) => (
  <section
    id={TREK_SECTION_IDS.plan}
    aria-labelledby="trek-plan-title"
    className={`${PANEL} flex scroll-mt-16 flex-col gap-4 p-4.5 shadow-[0_6px_16px_rgba(15,23,42,0.08)] md:p-8`}
  >
    <div className="flex flex-col gap-1">
      <p className={EYEBROW}>Fast reply on WhatsApp</p>
      <h2 id="trek-plan-title" className="text-[22px] leading-tight font-extrabold md:text-2xl">
        Book your {name}
      </h2>
      <p className="text-xs text-text">
        Direct local pricing, no middlemen. Fill this in and we open WhatsApp with your request already written.
      </p>
    </div>
    <TrekRequestForm trekName={name} days={days} groupPrices={groupPrices} />
  </section>
);
