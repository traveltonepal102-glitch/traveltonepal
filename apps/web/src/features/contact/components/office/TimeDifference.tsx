import { Icon } from "@ttn/ui/icon";

import type { TimeZoneRow } from "../../officeHours";

/** Navy card: Nepal's UTC offset and the office hours in Berlin, London and New York (summer and winter time). */
export const TimeDifference = ({ rows }: { rows: readonly TimeZoneRow[] }) => (
  <div className="flex flex-col gap-3 rounded-2xl bg-navy p-4.5 text-white md:p-5.5">
    <h3 className="inline-flex items-center gap-2 text-lg font-bold text-white">
      <Icon name="public" size={20} className="text-saffron" />
      Time difference
    </h3>
    <p className="text-caption font-normal text-navy-text">Nepal time is UTC+5:45. Our office hours in your time:</p>
    <dl className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.place} className="flex items-center justify-between gap-2.5 rounded-md bg-white/8 px-3 py-2.5 text-caption">
          <dt className="font-bold">{row.place}</dt>
          <dd className="text-right text-white/85">
            {row.summer} (summer)
            <span className="block text-[11px] text-navy-text">{row.winter} (winter)</span>
          </dd>
        </div>
      ))}
    </dl>
    <p className="text-xs text-navy-text">Outside these hours? Leave a WhatsApp message. We reply first thing in the morning.</p>
  </div>
);
