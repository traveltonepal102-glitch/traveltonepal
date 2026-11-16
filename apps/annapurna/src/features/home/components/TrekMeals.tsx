import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatPrice } from "@/lib/format";

import type { HomePoint, HomeTrek } from "../types";
import { PointList } from "./PointList";

/** Why meals are paid on the trail: the same company policy on every trek. */
const REASONS: readonly HomePoint[] = [
  {
    title: "Sie essen, worauf Sie Lust haben",
    text: "In der Höhe ändert sich der Appetit. Bestellen Sie, wonach Ihr Körper verlangt – von Dal Bhat bis zu Suppe oder Porridge.",
  },
  {
    title: "Das Geld bleibt im Dorf",
    text: "Sie bezahlen die Lodges direkt, so geht das gesamte Essensgeld an die Familien, die sie führen.",
  },
  {
    title: "Kein Pauschalaufschlag",
    text: "Verpflegungspakete sind oft teurer als nötig. So zahlen Sie den echten Menüpreis für das, was Sie essen.",
  },
  {
    title: "Ihre Ernährungswünsche",
    text: "Vegetarisch, vegan oder glutenfrei: Bestellen Sie vor Ort und bekommen Sie Ihr Essen so zubereitet, wie Sie es brauchen.",
  },
];

/** A box of tips, in the same look as "Included" above it. */
const TipList = ({
  title,
  points,
}: {
  title: string;
  points: readonly HomePoint[];
}) =>
  points.length > 0 && (
    <div className="flex flex-col gap-3.5 rounded-[14px] border border-solid border-line bg-snow p-6">
      <h3 className="text-xl! leading-6.5!">{title}</h3>
      <PointList points={points} icon="check" iconClass="text-navy" />
    </div>
  );

/** Why meals aren't in the price, what to budget and how food works on the trail. */
export const TrekMeals = ({
  meals,
}: {
  meals: NonNullable<HomeTrek["meals"]>;
}) => (
  <div className="flex flex-col gap-4 rounded-[14px] bg-cloud p-6">
    <h3 className="text-xl! leading-6.5!">Warum die Mahlzeiten nicht im Preis enthalten sind</h3>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-7 gap-y-3.5">
      {REASONS.map((reason) => (
        <li
          key={reason.title}
          className="flex items-start gap-2.5 text-base leading-6"
        >
          <TrailIcon name="check" size={20} className="mt-0.5 text-navy" />
          <span>
            <strong className="font-semibold text-ink">{reason.title}.</strong>{" "}
            {reason.text}
          </span>
        </li>
      ))}
    </ul>
    {meals.budget && (
      <p className="flex items-start gap-2.5 rounded-[10px] border border-solid border-cream-line bg-cream px-4 py-3 text-base leading-6 text-cream-ink">
        <TrailIcon name="tag" className="mt-0.75" />
        <span>
          <strong className="font-semibold">Tagesbudget fürs Essen:</strong> Rechnen Sie mit
          etwa {formatPrice(meals.budget.min, meals.budget.currency)}–{formatPrice(meals.budget.max, meals.budget.currency)} pro Tag für
          drei Mahlzeiten.
        </span>
      </p>
    )}
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
      <TipList title="Unterwegs" points={meals.trailTips} />
      <TipList title="Im Teehaus" points={meals.teahouseNotes} />
    </div>
  </div>
);
