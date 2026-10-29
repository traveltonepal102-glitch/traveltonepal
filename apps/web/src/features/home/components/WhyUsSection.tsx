import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Image from "next/image";

type Reason = { icon: IconName; title: string; text: string };

/** Static in code (TRD: home content lives in code, not the admin); the design's wording (Main.dc.html). */
const REASONS: readonly Reason[] = [
  { icon: "route", title: "Your trip, your way", text: "Every trek is private and planned around you. Change days, pace or route anytime, and we adjust at no extra cost." },
  {
    icon: "price_check",
    title: "Honest advice, always",
    text: "We tell you what we'd tell a friend, even if it means a smaller booking. Real prices, with permits, flights and lodging listed up front.",
  },
  {
    icon: "travel_explore",
    title: "Trek with an open mind",
    text: "Our guides introduce you to village families, monasteries and local food along the way. Guests who stay curious often say it changed how they see Nepal.",
  },
  { icon: "shield_person", title: "Guides from the valleys", text: "Your guide grew up in the region you trek and speaks your language." },
  {
    icon: "health_and_safety",
    title: "Safe at altitude",
    text: "Acclimatization days, daily oxygen checks and a rescue plan on every trek. Your safety is the one thing we won't bend on.",
  },
  {
    icon: "verified",
    title: "Licensed, local and fair",
    text: "Registered with the Government of Nepal and TAAN. You book directly with our team in Nepal, and porters get weight limits, warm gear, insurance and fair pay.",
  },
];

/**
 * "Why Travel To Nepal" (design: Main.dc.html). Story and photo on the left, six reasons on the right;
 * they sit side by side from lg, and the reasons grid fills 1–3 columns of at least 240px.
 */
export const WhyUsSection = () => (
  <section aria-labelledby="why-us-title" className="bg-navy py-16 text-white md:py-24">
    <div className="mx-auto flex max-w-content flex-wrap gap-12 px-4 md:px-6">
      <div className="flex grow basis-85 flex-col gap-5">
        <p className="inline-flex items-center gap-2 text-eyebrow text-saffron uppercase">
          <Icon name="verified" size={18} />
          Why Travel To Nepal
        </p>
        <h2 id="why-us-title" className="text-h2 tracking-tight text-white md:text-h1">
          What makes us different?
        </h2>
        <p className="text-body-lg text-navy-text">
          Three things guide every trek we plan. Your trip is built around you, our advice is always honest, and we help
          you see Nepal with an open mind.
        </p>
        {/* Grows to match the reasons grid when that is taller, so both columns end on the same line. */}
        <figure className="relative mt-1.5 min-h-75 flex-1 overflow-hidden rounded-xl">
          <Image
            src="/images/trail-to-everest-base-camp.jpg"
            alt="Trekkers on the rocky trail to Everest Base Camp below Himalayan peaks"
            fill
            sizes="(min-width: 1024px) 450px, 100vw"
            className="object-cover object-[50%_60%]"
          />
          <figcaption className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold">
            <Icon name="location_on" size={14} />
            On the trail to Everest Base Camp
          </figcaption>
        </figure>
      </div>

      {/* Rows stretch to the column height (no content-start), so the last cards line up with the photo. */}
      <ul className="grid grow-2 basis-120 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
        {REASONS.map((reason) => (
          <li key={reason.title} className="flex flex-col gap-3 rounded-xl bg-white/6 p-6">
            <span className="inline-flex size-12 items-center justify-center rounded-lg bg-saffron/14 text-saffron">
              <Icon name={reason.icon} size={26} />
            </span>
            <h3 className="text-h3 text-white">{reason.title}</h3>
            <p className="text-body-sm text-navy-text">{reason.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
