import { Icon } from "@ttn/ui/icon";

import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import { MILESTONES } from "../../aboutContent";
import { FOUNDER } from "../../founder";
import { SECTION, WRAP } from "../styles";
import { MilestoneTimeline } from "./MilestoneTimeline";
import { StoryPhotos } from "./StoryPhotos";

/** "Our story": the founder's story and quote beside a photo collage, then the milestones. */
export const StorySection = () => (
  <section id={ABOUT_SECTION_IDS.story} aria-labelledby="about-story-title" className={SECTION}>
    <div className={`${WRAP} flex flex-col gap-10`}>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <PageSectionHeading id="about-story-title" eyebrow="Our story" title="Born in the mountains, built in Kathmandu" />
          {FOUNDER.story.map((paragraph) => (
            <p key={paragraph} className="text-base leading-[1.75] text-text">
              {paragraph}
            </p>
          ))}
          <figure className="mt-1.5 flex items-start gap-3.5 rounded-xl border border-l-4 border-line border-l-saffron bg-surface px-5 py-4.5">
            <span aria-hidden="true" className="inline-flex size-14 flex-none items-center justify-center rounded-full border-2 border-brand bg-brand-tint text-brand">
              <Icon name="person" size={30} />
            </span>
            <div className="flex flex-col gap-1.5">
              <blockquote className="font-display text-lg leading-snug font-semibold text-ink">&ldquo;{FOUNDER.quote}&rdquo;</blockquote>
              <figcaption className="text-caption font-normal text-muted-foreground">
                <strong className="text-ink">{FOUNDER.name}</strong> · {FOUNDER.role}
              </figcaption>
            </div>
          </figure>
        </div>
        <StoryPhotos />
      </div>
      <MilestoneTimeline milestones={MILESTONES} />
    </div>
  </section>
);
