import { Icon } from "@ttn/ui/icon";

import { formatUsd } from "@/features/treks/format";

import type { TrekMeals } from "../../types";
import { PANEL } from "../styles";
import { MealTipList } from "./MealTipList";

/** Why meals are paid on the trail: the same company policy on every trek. */
const REASONS = [
  {
    icon: "restaurant",
    tone: "bg-saffron-tint text-saffron-deep",
    title: "Freedom of choice and appetite",
    text: "Appetite changes with altitude. Order what your body wants, from dal bhat to pasta, porridge or soup.",
  },
  {
    icon: "cottage",
    tone: "bg-green-tint text-whatsapp",
    title: "Direct support for teahouse families",
    text: "You pay the lodges directly, so all food money stays with the local families who run them.",
  },
  {
    icon: "payments",
    tone: "bg-brand-tint text-brand",
    title: "No package markups",
    text: "All-inclusive meal packages are often padded. Here you pay real menu prices for what you eat.",
  },
  {
    icon: "health_and_safety",
    tone: "bg-danger-tint text-danger",
    title: "Dietary needs and allergies",
    text: "Vegetarian, vegan or gluten-free: order on the spot and get food made the way you need it.",
  },
] as const;

/** "Why don't we include meals in our trekking package?": the reasons, the daily budget and food tips. */
export const MealsCard = ({ meals }: { meals: TrekMeals }) => (
  <div className={`${PANEL} mt-1 flex flex-col gap-4 rounded-xl p-4.5 md:p-6`}>
    <div className="flex flex-col gap-2 border-b border-muted pb-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="inline-flex items-center gap-2.5 text-lg leading-snug font-extrabold">
        <Icon name="restaurant" size={22} className="flex-none text-brand" />
        Why don&apos;t we include meals in our trekking package?
      </h3>
      <p className="flex-none self-start rounded-full border border-green-line bg-green-tint px-2.5 py-0.5 text-[11px] font-bold text-whatsapp">
        Trekker-first transparency
      </p>
    </div>

    <ul className="grid gap-4 md:grid-cols-2">
      {REASONS.map((reason) => (
        <li key={reason.title} className="flex items-start gap-3 rounded-xl border border-muted bg-page p-3.5">
          <span aria-hidden="true" className={`mt-0.5 inline-flex size-8 flex-none items-center justify-center rounded-md ${reason.tone}`}>
            <Icon name={reason.icon} size={18} />
          </span>
          <p className="flex flex-col gap-1">
            <strong className="font-display text-body-sm font-bold text-ink">{reason.title}</strong>
            <span className="text-xs text-text">{reason.text}</span>
          </p>
        </li>
      ))}
    </ul>

    {meals.dailyBudgetUsd && (
      <p className="flex items-center gap-3 rounded-xl border border-saffron-line bg-saffron-tint p-3.5 text-xs text-ink">
        <Icon name="lightbulb" className="flex-none text-saffron-deep" />
        <span>
          <strong>Average daily food budget:</strong> plan on about{" "}
          <strong className="text-saffron-ink">
            {formatUsd(meals.dailyBudgetUsd.min)}–{meals.dailyBudgetUsd.max} USD per day
          </strong>{" "}
          for hearty breakfasts, lunches, hot dinners and boiled drinking water or tea.
        </span>
      </p>
    )}

    <div className="mt-1 flex flex-col gap-3.5 rounded-xl border border-line bg-page p-4.5 md:p-5">
      <h4 className="inline-flex items-center gap-2 border-b border-line pb-2 text-[15px] font-extrabold tracking-wide uppercase">
        <Icon name="lightbulb" className="text-brand" />
        Pro tips and important notes
      </h4>
      <div className="grid gap-4 md:grid-cols-2">
        <MealTipList title="Trail pro tips" icon="check_circle" tone="green" points={meals.trailTips} />
        <MealTipList title="Essential teahouse notes" icon="warning" tone="saffron" points={meals.teahouseNotes} />
      </div>
    </div>
  </div>
);
