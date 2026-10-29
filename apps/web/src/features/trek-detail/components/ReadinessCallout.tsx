import { Icon } from "@ttn/ui/icon";

import { getAboutPage } from "@/features/about/services/aboutRepository";
import { trekReadinessCheckEmailUrl, trekReadinessCheckUrl } from "@/features/treks/inquiry";

const ACTION =
  "rounded-md border border-saffron-line bg-surface px-4 py-2.25 text-center font-bold text-saffron-ink hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** "Unsure about your fitness or readiness?": a free preparation check with the founder, on WhatsApp or by email. */
export const ReadinessCallout = async ({ trekName }: { trekName: string }) => {
  const { founder } = await getAboutPage();
  const contactName = founder?.shortName ?? "Travel To Nepal team";
  return (
  <div className="flex flex-col gap-3 rounded-xl border border-saffron-line bg-saffron-tint p-4 text-xs text-text sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="inline-flex size-8.5 flex-none items-center justify-center rounded-md bg-saffron text-ink">
        <Icon name="psychology" />
      </span>
      <p className="flex flex-col">
        <strong className="font-display text-body-sm font-bold text-ink">Unsure about your fitness or readiness?</strong>
        <span>Our lead trek director gives a free, no-obligation preparation check.</span>
      </p>
    </div>
    <div className="flex flex-none flex-wrap gap-2">
      <a href={trekReadinessCheckUrl({ name: trekName }, contactName)} target="_blank" rel="noopener noreferrer" className={ACTION}>
        {founder ? `Ask ${founder.shortName} on WhatsApp` : "Ask us on WhatsApp"}
      </a>
      <a href={trekReadinessCheckEmailUrl({ name: trekName }, contactName)} className={ACTION}>
        Email
      </a>
    </div>
  </div>
);
};
