import { Icon } from "@ttn/ui/icon";

import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";

import type { GuideCardView } from "../../lib/guideCard";

type GuideCardPreviewProps = {
  view: GuideCardView;
  name: string;
  role: string;
  quote: string;
  languages: string[];
  photo: Photo | null;
};

/** "How the card looks on the trek page": follows the form as it is typed. Empty parts show what goes there. */
export const GuideCardPreview = ({ view, name, role, quote, languages, photo }: GuideCardPreviewProps) => (
  <section aria-label="Card preview" className="flex flex-col gap-2 rounded-lg bg-page p-3">
    <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
      <Icon name="visibility" size={16} />
      How the card looks on the trek page
    </span>
    <div className="overflow-hidden rounded-xl border border-solid border-border bg-surface">
      <div className="relative flex h-29 items-center justify-center bg-brand-tint">
        {photo ? (
          <PhotoImage photo={photo} alt="" sizes="(min-width: 1200px) 40vw, 100vw" className="h-full w-full object-cover" />
        ) : (
          <span className="inline-flex size-18 items-center justify-center rounded-full bg-surface text-brand">
            <Icon name="person" size={34} />
          </span>
        )}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-surface px-2 py-0.5 text-[11px] font-bold text-navy">
          <Icon name={view.badge.icon} size={13} className="text-saffron-ink" />
          {view.badge.label}
        </span>
        {view.certBadge && (
          <span className="absolute top-2.5 right-2.5 rounded-md bg-whatsapp px-2 py-0.5 text-[11px] font-bold text-white">{view.certBadge}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-3.5 py-3 text-caption">
        <strong className="font-display text-base text-ink">{name || "Full name"}</strong>
        {view.experience && <span className="font-bold text-brand">{view.experience}</span>}
        <span className="font-semibold text-ink">{role || "Role"}</span>
        {view.home && <span className="text-muted-foreground">{view.home}</span>}
        <span className="text-text italic">“{quote || "A line in their own words"}”</span>
        <span className="text-text">
          <strong className="text-ink">Cert:</strong> {view.certLine || "—"}
        </span>
        <span className="text-text">
          <strong className="text-ink">Languages:</strong> {languages.join(", ") || "—"}
        </span>
      </div>
    </div>
    <span className="text-xs text-muted-foreground">Region pages and the About page show a shorter card: photo, name, role, years, quote and languages.</span>
  </section>
);
