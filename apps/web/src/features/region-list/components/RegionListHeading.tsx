import type { ReactNode } from "react";

type RegionListHeadingProps = {
  id: string;
  kicker: string;
  title: string;
  description?: string;
  /** Shown on the right, e.g. a "See all treks" link or a legend. */
  aside?: ReactNode;
};

/** Kicker, H2 and optional line that open each Regions page section. */
export const RegionListHeading = ({ id, kicker, title, description, aside }: RegionListHeadingProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex flex-col gap-1">
      <p className="text-eyebrow text-brand uppercase">{kicker}</p>
      <h2 id={id} className="text-[23px] leading-tight font-extrabold md:text-[28px]">
        {title}
      </h2>
      {description && <p className="text-body-sm text-text">{description}</p>}
    </div>
    {aside}
  </div>
);
