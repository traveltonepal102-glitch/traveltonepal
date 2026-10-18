"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/lib/pagination";

import { ALL_GUIDES_ID, EMPTY_GUIDE_FILTERS, GUIDES_PER_PAGE, filterGuides, guideListHref } from "../../guideFiltering";
import type { GuideFilters } from "../../guideFiltering";
import { countGuidesByTopic } from "../../guideLists";
import type { RegionOption } from "../../guideLists";
import { useGuideFilters } from "../../hooks/useGuideFilters";
import type { GuideTopicId } from "../../topics";
import type { TravelGuide } from "../../types";
import { WRAP } from "../styles";
import { GuideNoResults } from "./GuideNoResults";
import { GuideRegionSelect } from "./GuideRegionSelect";
import { GuideSearchStatus } from "./GuideSearchStatus";
import { GuideTopicFilter } from "./GuideTopicFilter";

/** What the server hands the list: the guides, their cards already rendered by slug, and the region menu. */
export type GuideListData = {
  guides: readonly TravelGuide[];
  cards: Readonly<Record<string, ReactNode>>;
  /** Regions that have guides. */
  regions: readonly RegionOption[];
};

type GuideListActions = {
  setTopic: (topic: GuideTopicId | null) => void;
  setRegion: (region: string | null) => void;
  clearSearch: () => void;
  clearAll: () => void;
  /** Left out in the static version, so the pager's links simply load the page. */
  goToPage?: (page: number) => void;
};

type GuideListViewProps = GuideListData & { filters: GuideFilters; actions: GuideListActions };

/** "Latest guides": title with region menu, topic chips, a page of cards and the pager. Pure view: state in, changes out. */
const GuideListView = ({ guides, cards, regions, filters, actions }: GuideListViewProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Chip counts follow the region and search, so each chip says what clicking it shows.
  const inRegionAndSearch = filterGuides(guides, { ...filters, topic: null });
  const matches = filterGuides(guides, filters);
  const { items, page, pageCount, from, to } = paginate(matches, filters.page, GUIDES_PER_PAGE);
  const { goToPage } = actions;

  // New page: back to the top of the list, and tell screen readers where they are.
  const showPage = goToPage
    ? (target: number) => {
        goToPage(target);
        headingRef.current?.focus({ preventScroll: true });
        sectionRef.current?.scrollIntoView({ block: "start" });
      }
    : undefined;

  return (
    <section
      ref={sectionRef}
      id={ALL_GUIDES_ID}
      aria-labelledby="all-guides-title"
      className="scroll-mt-4 border-t border-line pt-12 pb-10 md:pt-16"
    >
      <div className={`${WRAP} flex flex-col gap-5`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow text-brand uppercase">All guides</p>
            <h2 id="all-guides-title" ref={headingRef} tabIndex={-1} className="text-h2-sm tracking-tight outline-none md:text-h2">
              Latest guides
            </h2>
          </div>
          <GuideRegionSelect value={filters.region} regions={regions} onChange={actions.setRegion} />
        </div>

        <GuideTopicFilter
          active={filters.topic}
          total={inRegionAndSearch.length}
          countFor={countGuidesByTopic(inRegionAndSearch)}
          onPick={actions.setTopic}
        />
        <GuideSearchStatus total={matches.length} from={from} to={to} query={filters.q} onClearSearch={actions.clearSearch} />

        {items.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((guide) => (
              <li key={guide.slug}>{cards[guide.slug]}</li>
            ))}
          </ul>
        ) : (
          <GuideNoResults onClearAll={actions.clearAll} />
        )}

        <div className="pt-3">
          <Pagination
            label="Guide pages"
            page={page}
            pageCount={pageCount}
            hrefFor={(target) => guideListHref({ ...filters, page: target })}
            onPageChange={showPage}
          />
        </div>
      </div>
    </section>
  );
};

/** The live list: state read from and written to the URL. */
export const GuideListExplorer = (data: GuideListData) => {
  const { filters, ...actions } = useGuideFilters(data.regions.map((region) => region.slug));
  return <GuideListView {...data} filters={filters} actions={actions} />;
};

const doNothing = () => {};

/**
 * Pre-rendered version (no URL yet): page 1 of every guide. It is the Suspense fallback, so the
 * page's static HTML has the newest guides and real pager links for search engines and first paint.
 */
export const GuideListStatic = (data: GuideListData) => (
  <GuideListView
    {...data}
    filters={EMPTY_GUIDE_FILTERS}
    actions={{ setTopic: doNothing, setRegion: doNothing, clearSearch: doNothing, clearAll: doNothing }}
  />
);
