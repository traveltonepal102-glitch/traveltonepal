import { Icon } from "@ttn/ui/icon";

import { trekSpecs } from "../specs";
import type { SpecTone } from "../specs";
import type { TrekDetail } from "../types";

const TONES: Record<SpecTone, string> = {
  brand: "bg-brand-tint text-brand",
  green: "bg-green-tint text-whatsapp",
  navy: "bg-navy/10 text-navy",
  danger: "bg-danger-tint text-danger",
  saffron: "bg-saffron-tint text-saffron-deep",
};

/** "Trip overview and key specifications": twelve fact tiles on a blue panel. */
export const TrekOverview = ({ trek }: { trek: TrekDetail }) => (
  <section aria-labelledby="trek-overview-title" className="rounded-lg border border-brand/15 bg-brand-tint p-4.5 shadow-card md:p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-brand/15 pb-3.5">
      <h2 id="trek-overview-title" className="inline-flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase">
        <Icon name="info" className="text-brand" />
        {trek.headings.overview}
      </h2>
      <p className="rounded-full border border-green-line bg-green-tint px-2.5 py-0.5 text-[11px] font-bold text-whatsapp">
        Verified route {trek.currentSeason}
      </p>
    </div>

    {/* One small <dl> per spec: a <dl> may hold only <dt>/<dd> pairs, not the icon beside them. */}
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {trekSpecs(trek).map((spec) => (
        <li key={spec.label} className="flex flex-col items-start gap-2 rounded-md border border-line bg-surface p-3 shadow-card sm:flex-row sm:items-center sm:gap-2.5">
          <span aria-hidden="true" className={`inline-flex size-9 flex-none items-center justify-center rounded-full ${TONES[spec.tone]}`}>
            <Icon name={spec.icon} size={18} />
          </span>
          <dl className="flex min-w-0 flex-col leading-tight">
            <dt className="text-[10.5px] font-semibold tracking-wide break-words text-muted-foreground uppercase">{spec.label}</dt>
            <dd className={`mt-0.75 font-display text-caption font-bold ${spec.isHighlighted ? "text-whatsapp" : "text-ink"}`}>
              {spec.value}
            </dd>
          </dl>
        </li>
      ))}
    </ul>
  </section>
);
