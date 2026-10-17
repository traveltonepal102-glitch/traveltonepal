import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";

/** "Don't see your perfect trek?" tailor-made box under the Treks page results. */
export const CustomTrekCta = () => (
  <div className="flex items-center justify-between gap-5 rounded-xl border border-saffron-line bg-linear-135 from-saffron-tint to-surface to-65% p-4.5 max-md:flex-col max-md:items-stretch md:p-6">
    <div className="flex max-w-140 flex-col gap-1.5">
      <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-saffron-line px-3 py-1 text-xs font-extrabold tracking-wide text-saffron-ink uppercase">
        <Icon name="tune" size={15} className="text-saffron-deep" />
        Tailor-made
      </p>
      <h2 className="text-h3 font-extrabold">Don&apos;t see your perfect trek?</h2>
      <p className="text-body-sm text-text">
        Combine regions, add rest days or side trips, or plan a trek around your holiday dates. Changes are free.
      </p>
    </div>
    <ButtonLink
      href={getWhatsAppUrl("Hello! I'd like to plan a custom trek.")}
      variant="whatsapp"
      icon="chat"
      shape="rounded"
      isExternal
      className="flex-none"
    >
      Plan a custom trek
    </ButtonLink>
  </div>
);
