import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";

type TrekTopBarProps = {
  breadcrumbs: readonly BreadcrumbItem[];
  currentSeason: string;
};

/** Breadcrumb trail and the "season open" note, above the trek title. */
export const TrekTopBar = ({ breadcrumbs, currentSeason }: TrekTopBarProps) => (
  <div className="border-b border-line bg-surface">
    <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-6">
      <Breadcrumbs items={breadcrumbs} />
      <p className="inline-flex items-center gap-2 rounded-full border border-green-line bg-green-tint px-3 py-0.5 text-xs font-semibold text-whatsapp">
        <span aria-hidden="true" className="size-2 rounded-full bg-whatsapp" />
        {currentSeason} season open · start on any date you choose
      </p>
    </div>
  </div>
);
