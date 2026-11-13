import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatUsd } from "@/lib/format";

import type { HomePoint, HomeTrek } from "../types";
import { PointList } from "./PointList";

/** Why meals are paid on the trail: the same company policy on every trek. */
const REASONS: readonly HomePoint[] = [
  { title: "You eat what you want", text: "Appetite changes with altitude. Order what your body asks for, from dal bhat to soup or porridge." },
  { title: "The money stays in the village", text: "You pay the lodges directly, so all the food money goes to the families who run them." },
  { title: "No package markup", text: "Meal packages are often padded. Here you pay the real menu price for what you eat." },
  { title: "Your dietary needs", text: "Vegetarian, vegan or gluten-free: order on the spot and get food made the way you need it." },
];

/** A box of tips, in the same look as "Included" above it. */
const TipList = ({ title, points }: { title: string; points: readonly HomePoint[] }) =>
  points.length > 0 && (
    <div className="flex flex-col gap-3.5 rounded-[14px] border border-solid border-line bg-snow p-6">
      <h3 className="text-xl! leading-6.5!">{title}</h3>
      <PointList points={points} icon="check" iconClass="text-navy" />
    </div>
  );

/** Why meals aren't in the price, what to budget and how food works on the trail. */
export const TrekMeals = ({ meals }: { meals: NonNullable<HomeTrek["meals"]> }) => (
  <div className="flex flex-col gap-4 rounded-[14px] bg-cloud p-6">
    <h3 className="text-xl! leading-6.5!">Why meals aren’t in the price</h3>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-7 gap-y-3.5">
      {REASONS.map((reason) => (
        <li key={reason.title} className="flex items-start gap-2.5 text-base leading-6">
          <TrailIcon name="check" size={20} className="mt-0.5 text-navy" />
          <span>
            <strong className="font-semibold text-ink">{reason.title}.</strong> {reason.text}
          </span>
        </li>
      ))}
    </ul>
    {meals.budget && (
      <p className="flex items-start gap-2.5 rounded-[10px] border border-solid border-cream-line bg-cream px-4 py-3 text-base leading-6 text-cream-ink">
        <TrailIcon name="tag" className="mt-0.75" />
        <span>
          <strong className="font-semibold">Daily food budget:</strong> plan on about {formatUsd(meals.budget.min)}–{meals.budget.max} USD a day for three meals with boiled water or tea.
        </span>
      </p>
    )}
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
      <TipList title="On the trail" points={meals.trailTips} />
      <TipList title="In the teahouses" points={meals.teahouseNotes} />
    </div>
  </div>
);
