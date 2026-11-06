import { RichText } from "@/components/shared/RichText";
import { SiteImage } from "@/components/ui/SiteImage";

import { ABOUT_SECTIONS } from "../sections";
import type { AboutContent, Founder } from "../types";

type StorySectionProps = { story: AboutContent["story"]; founder?: Founder };

/** The founder's card beside the story, what the company set out to do, and "Our voice" with the founder's quote. */
export const StorySection = ({ story, founder }: StorySectionProps) => (
  <section id={ABOUT_SECTIONS.story} aria-labelledby="story-h" className="wrap flex flex-col gap-10 py-14 md:py-18">
    <div className="grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)]">
      {(story.photo || founder) && (
        <figure className="flex flex-col overflow-hidden rounded-2xl border border-solid border-line bg-snow shadow-card">
          {story.photo && (
            <div className="relative aspect-4/5 bg-forest-tint">
              <SiteImage image={story.photo} sizes="(min-width: 1024px) 460px, 100vw" className="object-cover object-[62%_40%]" />
            </div>
          )}
          {founder && (
            <figcaption className="flex flex-col gap-0.5 p-5">
              <span className="font-display text-xl leading-6.5 font-semibold text-ink">{founder.name}</span>
              {founder.role && <span className="text-[15px] leading-5.5 font-semibold text-forest">{founder.role}</span>}
              {story.origin && <span className="text-sm leading-5 text-muted">{story.origin}</span>}
            </figcaption>
          )}
        </figure>
      )}
      <div className="flex flex-col gap-4.5">
        <h2 id="story-h">{story.heading || "Our story"}</h2>
        <RichText doc={story.body} className="flex flex-col gap-4" />
      </div>
    </div>
    {story.goals.length > 0 && (
      <ul className="grid gap-4.5 md:grid-cols-3">
        {story.goals.map((goal) => (
          <li key={goal.title} className="flex flex-col gap-1.5 rounded-2xl border border-solid border-line bg-snow p-6">
            <h3 className="text-xl! leading-6.5!">{goal.title}</h3>
            {goal.text && <p className="text-[15px] leading-5.75">{goal.text}</p>}
          </li>
        ))}
      </ul>
    )}
    {story.voice.heading && (
      <div className="grid items-center gap-x-12 gap-y-5 rounded-2xl bg-forest-tint p-6 md:p-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <h3>{story.voice.heading}</h3>
          {story.voice.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-6.5">
              {paragraph}
            </p>
          ))}
        </div>
        {story.quote && (
          <blockquote className="flex flex-col gap-1">
            <p className="font-display text-[26px] leading-8.5 font-semibold text-forest-deep">“{story.quote}”</p>
            {founder && <footer className="text-[15px] leading-5.5 text-forest-deep">{founder.name}, founder</footer>}
          </blockquote>
        )}
      </div>
    )}
  </section>
);
