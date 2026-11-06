import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";

const PROMISES: readonly { icon: TrailIconName; title: string; text: string }[] = [
  { icon: "shield", title: "Permits handled.", text: "Restricted-area permit, MCAP and ACAP before you arrive." },
  { icon: "users", title: "Guides from the valley.", text: "Licensed, first-aid trained and fairly paid." },
  { icon: "heart", title: "Your pace.", text: "Private group only, we walk at the pace of the slowest trekker." },
];

/** Under the booking card: what you can count on. */
export const BookingPromises = () => (
  <ul className="flex flex-col gap-2.5 rounded-[14px] bg-stone px-5 py-4 text-[15px] leading-5.5">
    {PROMISES.map((promise) => (
      <li key={promise.title} className="flex items-start gap-2.5">
        <TrailIcon name={promise.icon} className="mt-0.5 text-forest" />
        <span>
          <strong className="font-semibold text-ink">{promise.title}</strong> {promise.text}
        </span>
      </li>
    ))}
  </ul>
);
