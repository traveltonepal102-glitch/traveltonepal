import { Icon } from "@ttn/ui/icon";

import { labelClass } from "@/components/ui/formStyles";

import { MEALS } from "../../../constants";
import type { Meal } from "../../../types";

type DayMealsFieldProps = {
  meals: Meal[];
  onChange: (meals: Meal[]) => void;
};

/** "Meals included": Breakfast, Lunch and Dinner, each on or off. Sent as dayMeals, e.g. "breakfast,dinner". */
export const DayMealsField = ({ meals, onChange }: DayMealsFieldProps) => (
  <div role="group" aria-label="Meals included" className="flex flex-col gap-1.5">
    <span className={labelClass}>Meals included</span>
    <div className="flex flex-wrap gap-1.5">
      {MEALS.map((meal) => {
        const isOn = meals.includes(meal.value);
        return (
          <button
            key={meal.value}
            type="button"
            aria-pressed={isOn}
            onClick={() => onChange(isOn ? meals.filter((other) => other !== meal.value) : MEALS.map((item) => item.value).filter((value) => value === meal.value || meals.includes(value)))}
            className="m-0 inline-flex min-h-8.5 cursor-pointer items-center gap-1 rounded-full border border-solid border-border bg-surface px-3.5 font-sans text-caption font-bold text-subtle hover:border-line-strong focus-visible:outline-2 focus-visible:outline-ring aria-pressed:border-green-line aria-pressed:bg-green-tint aria-pressed:text-whatsapp"
          >
            {isOn && <Icon name="check" size={16} />}
            {meal.label}
          </button>
        );
      })}
    </div>
    <input type="hidden" name="dayMeals" value={meals.join(",")} />
  </div>
);
