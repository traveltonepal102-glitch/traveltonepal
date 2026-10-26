import { Icon } from "@ttn/ui/icon";
import { SiteImage } from "@/components/ui/SiteImage";
import type { TrekGuide } from "@/features/team/types";

const ON_PHOTO = "absolute inline-flex items-center gap-1 text-[10px] text-white";

/** One guide: photo with specialty and certification, name, role, home, a quote and qualifications. */
export const GuideCard = ({ guide }: { guide: TrekGuide }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-page shadow-card">
    <div className="relative flex aspect-4/3 items-center justify-center bg-linear-160 from-[#d3e3f1] to-chart-3 text-navy/35">
      {guide.photo ? (
        <SiteImage image={guide.photo} sizes="300px" className="object-cover" />
      ) : (
        <Icon name="person" size={96} />
      )}
      <p className={`${ON_PHOTO} top-3 left-3 rounded-full border border-white/20 bg-ink/80 px-2.5 py-1 font-bold tracking-wide`}>
        <Icon name={guide.specialty.icon} size={13} className="text-saffron" />
        {guide.specialty.label}
      </p>
      <p className={`${ON_PHOTO} right-3 bottom-3 rounded-sm bg-whatsapp/95 px-2 py-0.5 font-semibold`}>
        <Icon name="verified" size={12} />
        {guide.certBadge}
      </p>
    </div>

    <div className="flex flex-1 flex-col gap-2.5 p-4">
      <div>
        <div className="flex items-baseline justify-between gap-1.5">
          <h3 className="text-base font-extrabold">{guide.name}</h3>
          <span className="text-xs font-semibold whitespace-nowrap text-muted-foreground">{guide.experience}</span>
        </div>
        <p className="mt-0.5 text-xs font-bold text-brand">{guide.role}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Icon name="location_on" size={14} />
          {guide.home}
        </p>
        {guide.quote && (
          <blockquote className="mt-2.5 rounded-md border border-line bg-surface p-2.5 text-xs text-text italic">“{guide.quote}”</blockquote>
        )}
      </div>

      <dl className="mt-auto flex flex-col gap-0.75 border-t border-line pt-2 text-[11px] leading-snug text-text">
        <div>
          <dt className="inline font-semibold text-muted-foreground">Cert:</dt> <dd className="inline font-medium">{guide.certifications}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-muted-foreground">Languages:</dt> <dd className="inline">{guide.languages.join(", ")}</dd>
        </div>
      </dl>
    </div>
  </article>
);
