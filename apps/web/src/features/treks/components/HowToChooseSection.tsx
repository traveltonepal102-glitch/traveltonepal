import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";

import { guidePath } from "@/lib/routes";

type Tip = { icon: IconName; tile: string; title: string; text: string; linkLabel: string; href: string };

/** Static in code (TRD: list-page intros live in code). */
const TIPS: readonly Tip[] = [
  {
    icon: "calendar_month",
    tile: "bg-brand-tint text-brand",
    title: "How many days do you have?",
    text: "Under 10 days: Poon Hill, Mardi Himal or Langtang. Two weeks or more: Everest Base Camp, Annapurna or Manaslu.",
    linkLabel: "Treks by length",
    href: "#trek-filters",
  },
  {
    icon: "health_and_safety",
    tile: "bg-green-tint text-whatsapp",
    title: "How fit are you, and how high?",
    text: "Easy treks stay below 4,000 m. Above 5,000 m you need good fitness and extra days to acclimatize.",
    linkLabel: "Fitness and altitude guide",
    href: guidePath("how-to-prepare-for-altitude"),
  },
  {
    icon: "wb_sunny",
    tile: "bg-saffron-tint text-saffron-deep",
    title: "When are you travelling?",
    text: "Spring and autumn suit almost every trek. In winter and the monsoon, choose lower or rain-shadow routes.",
    linkLabel: "Best time to trek",
    href: guidePath("best-time-to-trek-in-nepal"),
  },
];

/** "How to choose the right Nepal trek" (design: Treks.dc.html), three tips that link to guides. */
export const HowToChooseSection = () => (
  <section aria-labelledby="choose-trek-title" className="border-t border-line bg-surface py-12">
    <div className="mx-auto flex max-w-content flex-col gap-5 px-4 md:px-6">
      <div className="flex max-w-180 flex-col gap-1">
        <p className="text-eyebrow text-brand uppercase">Choosing a trek</p>
        <h2 id="choose-trek-title" className="text-h2-sm md:text-h2">
          How to choose the right Nepal trek
        </h2>
        <p className="text-body-sm text-text">Three questions decide most of it. Our travel guides go deeper on each one.</p>
      </div>
      <ul className="grid gap-4 lg:grid-cols-3">
        {TIPS.map((tip) => (
          <li key={tip.title}>
            <Link
              href={tip.href}
              className="flex h-full flex-col gap-2.5 rounded-lg border border-line bg-page p-5 text-ink transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className={`inline-flex size-10.5 items-center justify-center rounded-md ${tip.tile}`}>
                <Icon name={tip.icon} size={22} />
              </span>
              <h3 className="text-h4">{tip.title}</h3>
              <p className="text-caption font-normal text-text">{tip.text}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-caption font-bold text-brand">
                {tip.linkLabel}
                <Icon name="arrow_forward" size={16} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
