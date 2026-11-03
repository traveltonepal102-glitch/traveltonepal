import { Icon } from "@ttn/ui/icon";
import type { ReactNode } from "react";

import { ADMIN_SECTIONS } from "@/features/shell/navigation";

type SitesHeadingProps = {
  title: string;
  summary: string;
  /** Right of the heading, e.g. the "Add a site" button. */
  actions?: ReactNode;
};

/** The heading of the Sites screens, like the other main screens: icon, title, one line, actions. */
export const SitesHeading = ({ title, summary, actions }: SitesHeadingProps) => (
  <div className="flex flex-wrap items-start gap-3.5">
    <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
      <Icon name={ADMIN_SECTIONS.sites.icon} size={26} />
    </span>
    <div className="min-w-60 flex-1">
      <h1 className="m-0 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{title}</h1>
      <p className="m-0 mt-1 max-w-195 text-muted-foreground">{summary}</p>
    </div>
    {actions}
  </div>
);
