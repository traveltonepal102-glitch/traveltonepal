import { ClampedText } from "@/components/shared/ClampedText";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatPrice } from "@/lib/format";

import type { HomePoint, HomeTrek } from "../types";
import { PointList } from "./PointList";

/** Why meals are paid on the trail: the same company policy on every trek. */
const REASONS: readonly HomePoint[] = [
  {
    title: "Du isst, worauf du Lust hast",
    text: "In der Höhe ändert sich der Appetit. Bestell, wonach dein Körper verlangt – von Dal Bhat bis zu Suppe oder Porridge.",
  },
  {
    title: "Das Geld bleibt im Dorf",
    text: "Du bezahlst die Lodges direkt, so geht das gesamte Essensgeld an die Sherpa-Familien, die sie führen.",
  },
  {
    title: "Kein Pauschalaufschlag",
    text: "Verpflegungspakete sind oft teurer als nötig. So zahlst du den echten Menüpreis für das, was du isst.",
  },
  {
    title: "Deine Ernährungswünsche",
    text: "Vegetarisch, vegan oder glutenfrei: Bestell vor Ort und bekomm dein Essen so zubereitet, wie du es brauchst.",
  },
];

/** A box of tips, in the same look as "Im Preis enthalten" above it. */
const TipList = ({
  title,
  points,
}: {
  title: string;
  points: readonly HomePoint[];
}) =>
  points.length > 0 && (
    <div className="flex flex-col gap-3.5 rounded-[20px] border border-solid border-line bg-snow p-6 text-text">
      <h3 className="text-xl! leading-6.5!">{title}</h3>
      <PointList points={points} icon="check" iconClass="text-ocean" />
    </div>
  );

/** Why meals aren't in the price, what to budget and how food works on the trail. */
export const TrekMeals = ({
  meals,
}: {
  meals: NonNullable<HomeTrek["meals"]>;
}) => (
  <div className="flex flex-col gap-4 rounded-[20px] bg-ocean p-7 text-on-ocean-muted max-sm:p-5">
    <h3 className="text-[22px]! leading-7! text-snow!">Warum die Mahlzeiten nicht im Preis enthalten sind</h3>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-7 gap-y-3.5">
      {REASONS.map((reason) => (
        <li
          key={reason.title}
          className="flex items-start gap-2.5 text-base leading-6"
        >
          <TrailIcon name="check" size={20} className="mt-0.5 text-glacier" />
          <span>
            <strong className="font-semibold text-snow">{reason.title}.</strong>{" "}
            {reason.text}
          </span>
        </li>
      ))}
    </ul>
    {meals.budget && (
      <p className="m-0 flex max-w-none items-start gap-2.5 rounded-xl bg-white/10 px-4 py-3 text-base leading-6 text-snow">
        <TrailIcon name="tag" className="mt-0.75 text-glacier" />
        <span>
          <strong className="font-semibold">Tagesbudget fürs Essen:</strong> Rechne mit
          etwa <strong className="text-glacier">{formatPrice(meals.budget.min, meals.budget.currency)}–{formatPrice(meals.budget.max, meals.budget.currency)} pro Tag</strong> für
          drei Mahlzeiten.
        </span>
      </p>
    )}
    {(meals.trailTips.length > 0 || meals.teahouseNotes.length > 0) && (
      // The tips are long: their first lines, then the button to read on (all of them are in the page for search engines).
      <ClampedText lines={13} className="text-base leading-6" buttonClassName="text-glacier hover:text-snow">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          <TipList title="Unterwegs" points={meals.trailTips} />
          <TipList title="In den Teehäusern" points={meals.teahouseNotes} />
        </div>
      </ClampedText>
    )}
  </div>
);
