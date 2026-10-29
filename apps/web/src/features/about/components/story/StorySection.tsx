import { Icon } from "@ttn/ui/icon";

import { RichText } from "@/components/shared/RichText";
import { SiteImage } from "@/components/ui/SiteImage";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutPageContent, Founder } from "../../types";
import { BIG_QUOTE, Paragraphs } from "../beliefs/BeliefParts";
import { WRAP } from "../styles";

type StorySectionProps = { story: AboutPageContent["story"]; founder?: Founder };

/**
 * "Our story" (design: About.dc.html): the founder with his photo beside why he started the company, his three
 * goals, and "Our voice" with his quote.
 */
export const StorySection = ({ story, founder }: StorySectionProps) => (
  <section id={ABOUT_SECTION_IDS.story} aria-labelledby="about-story-title" className="scroll-mt-14 border-t border-line bg-surface py-16 md:py-22">
    <div className={`${WRAP} flex flex-col gap-10`}>
      <div className="flex flex-wrap items-stretch gap-x-14 gap-y-10">
        {(story.photo || founder) && (
          <figure className="flex min-w-0 flex-[0_1_360px] flex-col overflow-hidden rounded-2xl border border-line bg-page max-sm:flex-auto">
            {story.photo && (
              <div className="relative h-95 bg-navy">
                <SiteImage image={story.photo} sizes="360px" className="object-cover object-[62%_40%]" />
              </div>
            )}
            {founder && (
              <figcaption className="flex flex-col gap-0.5 px-4.5 py-4">
                <span className="font-display text-lg leading-6 font-bold text-ink">{founder.name}</span>
                {founder.role && <span className="text-[13px] leading-5 font-bold text-brand">{founder.role}</span>}
                {story.origin && (
                  <span className="flex items-center gap-1 text-xs leading-[18px] text-muted-foreground">
                    <Icon name="location_on" size={14} />
                    {story.origin}
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        )}
        <div className="flex min-w-0 flex-[1_1_480px] flex-col justify-center gap-4.5">
          <p className="text-eyebrow text-brand uppercase">Our story</p>
          <h2 id="about-story-title" className="text-h1-sm tracking-tight md:text-h1">
            {story.heading || "Our story"}
          </h2>
          <RichText doc={story.body} className="flex flex-col gap-4.5 text-[17px] leading-[29px] text-text" />
        </div>
      </div>

      {story.goals.length > 0 && (
        <ol className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {story.goals.map((goal, index) => {
            const isLast = index === story.goals.length - 1;
            return (
              <li key={goal.title} className={`flex flex-col gap-3 rounded-2xl p-6.5 ${isLast ? "bg-navy text-white" : "border border-line bg-page"}`}>
                <span className={`font-display text-sm font-extrabold tracking-[0.08em] ${isLast ? "text-saffron" : "text-saffron-ink"}`}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={`font-display text-xl leading-[26px] font-bold ${isLast ? "text-white" : ""}`}>{goal.title}</h3>
                {goal.text && <p className={`text-[15px] leading-6 ${isLast ? "text-navy-text" : "text-text"}`}>{goal.text}</p>}
              </li>
            );
          })}
        </ol>
      )}

      {story.voice.heading && (
        <div className="flex flex-wrap items-center gap-x-14 gap-y-8 rounded-2xl border border-saffron-line bg-saffron-tint p-6 md:p-10">
          <div className="flex min-w-0 flex-[1.4_1_460px] flex-col gap-3.5">
            {story.voice.eyebrow && <p className="text-eyebrow text-saffron-ink uppercase">{story.voice.eyebrow}</p>}
            <h3 className="font-display text-[26px] leading-8 font-extrabold md:text-[30px] md:leading-9">{story.voice.heading}</h3>
            <Paragraphs paragraphs={story.voice.paragraphs} size="md" />
          </div>
          {story.quote && (
            <blockquote className="min-w-0 flex-[1_1_300px] border-l-4 border-saffron pl-6">
              <p className={`${BIG_QUOTE} text-navy`}>&ldquo;{story.quote}&rdquo;</p>
              {founder && <footer className="mt-2.5 text-sm font-semibold text-saffron-ink">{founder.name}, founder</footer>}
            </blockquote>
          )}
        </div>
      )}
    </div>
  </section>
);
