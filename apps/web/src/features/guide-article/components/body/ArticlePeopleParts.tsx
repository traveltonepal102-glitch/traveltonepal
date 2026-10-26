import { Icon } from "@ttn/ui/icon";

import { SiteImage } from "@/components/ui/SiteImage";

import type { GuidePerson } from "../../types";
import { LocalTip } from "./LocalTip";

/** A guide's round photo, or a person icon while there is none. */
const Avatar = ({ person, size }: { person: GuidePerson; size: "sm" | "lg" }) => (
  <span className={`relative inline-flex flex-none items-center justify-center overflow-hidden rounded-full bg-brand-tint text-brand ${size === "lg" ? "size-16" : "size-11"}`}>
    {person.photo ? <SiteImage image={person.photo} sizes={size === "lg" ? "64px" : "44px"} className="object-cover" /> : <Icon name="person" size={size === "lg" ? 32 : 22} />}
  </span>
);

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** "Guide's tip": local advice with the guide's name. */
export const GuideTip = ({ guide, text }: { guide: GuidePerson; text: string }) => <LocalTip title={`${firstName(guide.name)}'s tip`} text={text} />;

/** "Guide quote": a guide's own words, with their photo, name and role. */
export const GuideWords = ({ guide, text }: { guide: GuidePerson; text: string }) => (
  <figure className="flex flex-col gap-3 rounded-2xl border border-line bg-page px-5.5 py-5">
    <blockquote className="text-[17px] leading-relaxed text-ink italic">“{text}”</blockquote>
    <figcaption className="flex items-center gap-3">
      <Avatar person={guide} size="sm" />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-base font-bold text-ink">{guide.name}</span>
        {guide.role && <span className="text-caption text-muted-foreground">{guide.role}</span>}
      </span>
    </figcaption>
  </figure>
);

/** "Meet the guides": small cards of the guides who lead these treks. */
export const MeetGuides = ({ heading, guides }: { heading: string; guides: readonly GuidePerson[] }) => (
  <section aria-label={heading || "Meet the guides"} className="flex flex-col gap-3">
    {heading && <h3 className="font-display text-lg font-bold text-ink">{heading}</h3>}
    <ul className="grid gap-3 sm:grid-cols-2">
      {guides.map((guide) => (
        <li key={guide.name} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
          <Avatar person={guide} size="lg" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-display text-base font-bold text-ink">{guide.name}</p>
            {guide.role && <p className="text-caption font-semibold text-brand">{guide.role}</p>}
            {guide.quote && <p className="text-caption text-text italic">“{guide.quote}”</p>}
          </div>
        </li>
      ))}
    </ul>
  </section>
);
