import { Icon } from "@ttn/ui/icon";

import type { TrekMeals } from "../../types";
import { MealTipList } from "./MealTipList";

/**
 * "Pro tips and important notes": its own section after "What's covered" (an h2: the tips are about the whole trail,
 * not only meals), with the trail tips first and the teahouse notes below them. Left out while both lists are empty.
 */
export const TrekProTips = ({ meals }: { meals: Pick<TrekMeals, "trailTips" | "teahouseNotes"> }) => {
  if (meals.trailTips.length === 0 && meals.teahouseNotes.length === 0) return null;
  return (
    <section aria-labelledby="trek-pro-tips-title" className="flex flex-col gap-3.5 rounded-xl border border-line bg-page p-4.5 md:p-5">
      <h2 id="trek-pro-tips-title" className="inline-flex items-center gap-2 border-b border-line pb-2 text-[15px] font-extrabold tracking-wide uppercase">
        <Icon name="lightbulb" className="text-brand" />
        Pro tips and important notes
      </h2>
      <div className="grid gap-4">
        {meals.trailTips.length > 0 && <MealTipList title="Trail pro tips" icon="check_circle" tone="green" points={meals.trailTips} />}
        {meals.teahouseNotes.length > 0 && <MealTipList title="Essential teahouse notes" icon="warning" tone="saffron" points={meals.teahouseNotes} />}
      </div>
    </section>
  );
};
