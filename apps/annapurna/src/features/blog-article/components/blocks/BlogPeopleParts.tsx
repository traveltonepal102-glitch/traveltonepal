import type { GuidePerson } from "@ttn/site-data/guideBlocks";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

const Portrait = ({ person, size }: { person: GuidePerson; size: "small" | "large" }) => (
  <span className={`relative flex flex-none items-center justify-center overflow-hidden rounded-full bg-sky text-navy ${size === "small" ? "size-13" : "size-18"}`}>
    {person.photo ? <SiteImage image={person.photo} sizes={size === "small" ? "52px" : "72px"} className="object-cover" /> : <TrailIcon name="users" size={size === "small" ? 22 : 28} />}
  </span>
);

const Who = ({ person }: { person: GuidePerson }) => (
  <span className="flex min-w-0 flex-col">
    <span className="font-semibold text-ink">{person.name}</span>
    {person.role && <span className="text-sm leading-5 text-muted">{person.role}</span>}
  </span>
);

/** A guide's tip, with who it comes from. */
export const GuideTip = ({ guide, text }: { guide: GuidePerson; text: string }) => (
  <aside aria-label={`A tip from ${guide.name}`} className="flex flex-col gap-3 rounded-2xl bg-cream p-5">
    <p className="leading-6.5 text-ink">
      <strong className="font-semibold">Local tip:</strong> {text}
    </p>
    <div className="flex items-center gap-3">
      <Portrait person={guide} size="small" />
      <Who person={guide} />
    </div>
  </aside>
);

/** A guide's own words. */
export const GuideQuote = ({ guide, text }: { guide: GuidePerson; text: string }) => (
  <figure className="flex flex-col gap-3 rounded-2xl border border-solid border-line p-5">
    <blockquote className="font-display text-[22px] leading-7.75 font-semibold text-navy-deep">“{text}”</blockquote>
    <figcaption className="flex items-center gap-3">
      <Portrait person={guide} size="small" />
      <Who person={guide} />
    </figcaption>
  </figure>
);

/** The guides behind the blog. */
export const MeetGuides = ({ heading, guides }: { heading: string; guides: readonly GuidePerson[] }) => (
  <section aria-label={heading || "Meet the guides"} className="flex flex-col gap-3">
    {heading && <h3>{heading}</h3>}
    <ul className="grid gap-3 sm:grid-cols-2">
      {guides.map((guide) => (
        <li key={guide.name} className="flex flex-col gap-3 rounded-2xl border border-solid border-line p-4.5">
          <div className="flex items-center gap-3">
            <Portrait person={guide} size="large" />
            <Who person={guide} />
          </div>
          {guide.quote && <p className="text-[15px] leading-5.75">“{guide.quote}”</p>}
        </li>
      ))}
    </ul>
  </section>
);
