import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";

const PROMISES: readonly { icon: TrailIconName; tint: string; title: string; text: string }[] = [
  { icon: "shield", tint: "bg-azure", title: "Permits handled.", text: "ACAP and TIMS arranged before you arrive." },
  { icon: "users", tint: "bg-ember", title: "Guides from the region.", text: "Licensed, first-aid trained and fairly paid." },
  { icon: "heart", tint: "bg-whatsapp", title: "Your pace.", text: "Private group only: we walk at the pace of the slowest trekker." },
];

/** The navy band under the top of the page: what you can count on, on every trek. */
export const BookingPromises = () => (
  <section aria-label="What you can count on" className="bg-navy text-snow">
    <ul className="wrap grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
      {PROMISES.map((promise) => (
        <li key={promise.title} className="flex items-start gap-3.5 py-6 pr-6">
          <span aria-hidden="true" className={`inline-flex size-11 flex-none items-center justify-center rounded-xl ${promise.tint}`}>
            <TrailIcon name={promise.icon} size={22} />
          </span>
          <span className="flex flex-col">
            <strong className="font-semibold">{promise.title}</strong>
            <span className="text-[15px] leading-5.5 text-on-navy-muted">{promise.text}</span>
          </span>
        </li>
      ))}
    </ul>
  </section>
);
