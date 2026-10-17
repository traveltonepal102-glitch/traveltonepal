import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import { trekPath } from "@/lib/routes";

import { formatAltitude, formatUsd } from "../format";
import type { TrekSummary } from "../types";
import { TrekPhotoPlaceholder } from "./TrekPhotoPlaceholder";

const Fact = ({ icon, children }: { icon: IconName; children: string }) => (
  <span className="inline-flex items-center gap-1">
    <Icon name={icon} size={15} className="text-brand" />
    {children}
  </span>
);

/**
 * Trek summary card. One link (the name) stretched over the whole card, so keyboard and
 * screen-reader users meet a single link instead of three to the same page.
 */
export const TrekCard = ({ trek }: { trek: TrekSummary }) => (
  <article className="relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-card transition-shadow hover:shadow-raised has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring">
    <div className="relative aspect-video bg-brand-tint">
      {trek.image ? (
        <Image
          src={trek.image.src}
          alt={trek.image.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <TrekPhotoPlaceholder />
      )}
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-sm bg-white/95 px-2 py-0.5 text-xs font-bold text-navy">
        <Icon name="location_on" size={14} className="text-brand" />
        {trek.region}
      </span>
    </div>

    <div className="flex flex-1 flex-col gap-2 p-4">
      <h3 className="text-h3">
        <Link href={trekPath(trek.slug)} className="outline-none after:absolute after:inset-0">
          {trek.name}
        </Link>
      </h3>
      <p className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-caption font-normal text-muted-foreground">
        <Fact icon="calendar_month">{`${trek.days} days`}</Fact>
        <Fact icon="altitude">{formatAltitude(trek.maxAltitudeM)}</Fact>
        <Fact icon="speed">{trek.difficulty}</Fact>
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-muted pt-2">
        <span className="text-caption font-normal text-muted-foreground">
          From <strong className="font-display text-h4 text-brand">{formatUsd(trek.priceFromUsd)}</strong>
        </span>
        <span aria-hidden="true" className="inline-flex items-center gap-1 text-body-sm font-bold text-brand">
          View trek
          <Icon name="arrow_forward" size={16} />
        </span>
      </div>
    </div>
  </article>
);
