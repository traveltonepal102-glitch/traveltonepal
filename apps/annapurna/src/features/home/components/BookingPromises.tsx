import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";

const PROMISES: readonly { icon: TrailIconName; tint: string; title: string; text: string }[] = [
  { icon: "shield", tint: "bg-azure", title: "Genehmigungen erledigt.", text: "ACAP und TIMS besorgen wir vor Ihrer Ankunft." },
  { icon: "users", tint: "bg-ember", title: "Guides aus der Region.", text: "Lizenziert, in Erster Hilfe geschult und fair bezahlt." },
  { icon: "heart", tint: "bg-whatsapp", title: "Ihr Tempo.", text: "Nur private Gruppen: Wir gehen im Tempo der langsamsten Person." },
];

/** The navy band under the top of the page: what you can count on, on every trek. */
export const BookingPromises = () => (
  <section aria-label="Darauf können Sie sich verlassen" className="bg-navy text-snow">
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
