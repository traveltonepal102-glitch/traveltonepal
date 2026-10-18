import { countGuidesByTopic } from "../guideLists";
import { GUIDE_TOPICS } from "../topics";
import type { TravelGuide } from "../types";
import { GuideTopicCard } from "./GuideTopicCard";
import { WRAP } from "./styles";

/** "Browse by topic": one card per topic with its guide count. Four across on desktop, two on tablet, one on phones. */
export const GuideTopicsSection = ({ guides }: { guides: readonly TravelGuide[] }) => {
  const countFor = countGuidesByTopic(guides);

  return (
    <section aria-labelledby="guide-topics-title" className="pb-10 md:pb-12">
      <div className={`${WRAP} flex flex-col gap-5`}>
        <div className="flex flex-col gap-2">
          <p className="text-eyebrow text-brand uppercase">Browse by topic</p>
          <h2 id="guide-topics-title" className="text-h2-sm tracking-tight md:text-h2">
            What do you need to know?
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDE_TOPICS.map((topic) => (
            <li key={topic.id}>
              <GuideTopicCard topic={topic} guideCount={countFor(topic.id)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
