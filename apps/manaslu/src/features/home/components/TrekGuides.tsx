import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeTrek, HomeTrekGuide } from "../types";

const GuideCard = ({ guide }: { guide: HomeTrekGuide }) => (
  <article className="flex flex-col overflow-hidden rounded-[14px] border border-solid border-line bg-snow shadow-card">
    <div className="relative flex aspect-4/3 items-center justify-center bg-forest-tint text-forest/40">
      {guide.photo ? <SiteImage image={guide.photo} sizes="(min-width: 768px) 360px, 100vw" className="object-cover" /> : <TrailIcon name="users" size={64} />}
      <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-eyebrow font-semibold text-forest-deep">{guide.badge}</span>
      <span className="absolute right-3 bottom-3 rounded-full bg-saffron px-2.5 py-1 text-eyebrow font-semibold text-ink">{guide.certBadge}</span>
    </div>
    <div className="flex flex-1 flex-col gap-2.5 px-5 pt-4 pb-5">
      <div>
        <h3 className="text-xl! leading-6.5!">{guide.name}</h3>
        <p className="text-[15px] leading-5.5 font-semibold text-forest">{guide.role}</p>
        <p className="text-sm leading-5 text-muted">{[guide.home, guide.experience].filter(Boolean).join(" · ")}</p>
      </div>
      {guide.quote && <blockquote className="rounded-[10px] bg-stone px-3.5 py-2.5 text-[15px] leading-5.5 italic">“{guide.quote}”</blockquote>}
      <dl className="mt-auto flex flex-col gap-1 border-t border-solid border-line pt-2.5 text-sm leading-5">
        <div>
          <dt className="inline font-semibold text-ink">Certificates: </dt>
          <dd className="inline">{guide.certifications}</dd>
        </div>
        {guide.languages.length > 0 && (
          <div>
            <dt className="inline font-semibold text-ink">Languages: </dt>
            <dd className="inline">{guide.languages.join(", ")}</dd>
          </div>
        )}
      </dl>
    </div>
  </article>
);

/** The guides who lead this trek. */
export const TrekGuides = ({ guides }: { guides: HomeTrek["guides"] }) => (
  <section aria-labelledby="guides-team-h" id="guides" className="flex flex-col gap-5">
    <SectionHeading id="guides-team-h" eyebrow="Your local team" title={guides.heading}>
      {guides.intro && <p>{guides.intro}</p>}
    </SectionHeading>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 max-sm:grid-cols-1">
      {guides.team.map((guide) => (
        <GuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  </section>
);
