import Image from "next/image";
import Link from "next/link";

import { ICON_TONES } from "@/components/shared/iconTones";
import { ROUTES, guidePath } from "@/lib/routes";

import type { RegionArticle } from "../types";
import { RegionSectionHeading } from "./RegionSectionHeading";
import { CARD, WRAP } from "./styles";

type RegionTravelGuidesProps = { regionName: string; articles: readonly RegionArticle[] };

/** "Before you go": travel guides about the region. */
export const RegionTravelGuides = ({ regionName, articles }: RegionTravelGuidesProps) => {
  if (articles.length === 0) return null;

  return (
    <section id="travel-guides" aria-labelledby="region-articles-title" className="scroll-mt-14 border-y border-line bg-surface py-14">
      <div className={`${WRAP} flex flex-col gap-5.5`}>
        <RegionSectionHeading
          id="region-articles-title"
          kicker="Travel guides"
          title={`Before you go to ${regionName}`}
          link={{ href: ROUTES.guides, label: "All travel guides" }}
        />
        <ul className="grid gap-4.5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={guidePath(article.slug)}
                className={`${CARD} flex h-full flex-col overflow-hidden text-inherit transition-shadow hover:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
              >
                <span className="relative block h-47.5">
                  <Image src={article.image.src} alt={article.image.alt} fill sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                </span>
                <span className="flex flex-col gap-2 p-4.5">
                  <span className={`self-start rounded-full px-2.5 py-0.75 text-xs font-bold ${ICON_TONES[article.tone]}`}>{article.category}</span>
                  <span className="font-display text-[19px] leading-snug font-bold text-ink">{article.title}</span>
                  <span className="text-caption font-normal text-muted-foreground">{article.readMinutes} min read</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
