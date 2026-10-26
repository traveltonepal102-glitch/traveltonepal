import { Icon } from "@ttn/ui/icon";

import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { RichText } from "@/components/shared/RichText";
import { SiteImage } from "@/components/ui/SiteImage";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutPageContent, Founder, Milestone } from "../../types";
import { SECTION, WRAP } from "../styles";
import { MilestoneTimeline } from "./MilestoneTimeline";
import { StoryPhotos } from "./StoryPhotos";

type StorySectionProps = { story: AboutPageContent["story"]; founder?: Founder; milestones: readonly Milestone[] };

/** "Our story": the founder's story and quote beside a photo collage, then the milestones (from Pages › About). */
export const StorySection = ({ story, founder, milestones }: StorySectionProps) => (
  <section id={ABOUT_SECTION_IDS.story} aria-labelledby="about-story-title" className={SECTION}>
    <div className={`${WRAP} flex flex-col gap-10`}>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <PageSectionHeading id="about-story-title" eyebrow="Our story" title={story.heading || "Our story"} />
          <RichText doc={story.body} className="flex flex-col gap-4 text-base leading-[1.75] text-text" />
          {story.quote && (
            <figure className="mt-1.5 flex items-start gap-3.5 rounded-xl border border-l-4 border-line border-l-saffron bg-surface px-5 py-4.5">
              <span aria-hidden="true" className="relative inline-flex size-14 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-brand bg-brand-tint text-brand">
                {founder?.photo ? <SiteImage image={{ ...founder.photo, alt: "" }} sizes="56px" className="object-cover" /> : <Icon name="person" size={30} />}
              </span>
              <div className="flex flex-col gap-1.5">
                <blockquote className="font-display text-lg leading-snug font-semibold text-ink">&ldquo;{story.quote}&rdquo;</blockquote>
                {founder && (
                  <figcaption className="text-caption font-normal text-muted-foreground">
                    <strong className="text-ink">{founder.name}</strong>
                    {founder.role && ` · ${founder.role}`}
                  </figcaption>
                )}
              </div>
            </figure>
          )}
        </div>
        <StoryPhotos photos={story.photos} />
      </div>
      {milestones.length > 0 && <MilestoneTimeline milestones={milestones} />}
    </div>
  </section>
);
