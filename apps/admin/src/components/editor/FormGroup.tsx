import { useId } from "react";
import type { ReactNode } from "react";

type FormGroupProps = {
  title: string;
  /** Where these fields show, e.g. "Trek, region and About pages". */
  where?: string;
  children: ReactNode;
};

/** One group of fields in a drawer form (design: Admin-people's drawer groups, each under a line). */
export const FormGroup = ({ title, where, children }: FormGroupProps) => {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3 border-t border-solid border-border pt-4">
      <h3 id={titleId} className="m-0 flex flex-wrap items-center gap-2 font-display text-base font-bold text-ink">
        {title}
        {where && <span className="rounded-full bg-brand-tint px-2 py-0.5 font-sans text-[11px] font-bold text-brand">{where}</span>}
      </h3>
      {children}
    </section>
  );
};
