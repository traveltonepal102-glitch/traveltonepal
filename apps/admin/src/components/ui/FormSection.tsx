import { useId } from "react";
import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  hint?: string;
  /** Top-right of the card, e.g. a status chip. */
  aside?: ReactNode;
  children: ReactNode;
};

/** A white card grouping related fields in an editor (design: .ad-card.ad-sec). */
export const FormSection = ({ title, hint, aside, children }: FormSectionProps) => {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-3.5 rounded-lg border border-solid border-border bg-surface p-5 max-tablet:p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 id={titleId} className="m-0 font-display text-h4 text-ink">
            {title}
          </h3>
          {hint && <p className="m-0 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
};
