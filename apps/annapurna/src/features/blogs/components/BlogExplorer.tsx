"use client";

import type { MouseEvent } from "react";

import { GuideCard } from "@/features/home/components/GuideCard";
import type { HomeGuide } from "@/features/home/types";
import { ROUTES } from "@/lib/routes";

import { EMPTY_BLOG_FILTERS, blogTopics, serializeBlogFilters, toBlogPage } from "../blogFiltering";
import type { BlogFilters } from "../blogFiltering";
import { useBlogFilters } from "../hooks/useBlogFilters";
import { isPlainClick } from "../isPlainClick";
import { BlogPagination } from "./BlogPagination";
import { BlogSearchBox } from "./BlogSearchBox";

const LIST_ID = "blog-list";
const CHIP = "inline-flex min-h-10 items-center rounded-full border border-solid px-4 text-[15px] font-semibold no-underline";

/** A link to these filters; with none, the page's own address. */
const hrefOf = (filters: BlogFilters) => {
  const query = serializeBlogFilters(filters);
  return query ? `${ROUTES.blogs}?${query}` : ROUTES.blogs;
};

const countWords = (total: number) => `${total} ${total === 1 ? "blog" : "blogs"}`;

/** "2 blogs match “permit” in Planning", or how many there are and which page this is. */
const statusLine = (total: number, q: string, topicLabel: string | undefined, page: number, pageCount: number) => {
  const where = topicLabel ? ` in ${topicLabel}` : "";
  if (q) return `${countWords(total)} ${total === 1 ? "matches" : "match"} “${q}”${where}`;
  return `${countWords(total)}${where}${pageCount > 1 ? `, page ${page} of ${pageCount}` : ""}`;
};

type ViewProps = { guides: readonly HomeGuide[]; filters: BlogFilters; onChange?: (next: BlogFilters, history: "push" | "replace") => void };

const BlogExplorerView = ({ guides, filters, onChange }: ViewProps) => {
  const topics = blogTopics(guides);
  const { items, page, pageCount, total, isFiltering } = toBlogPage(guides, filters);
  const topicLabel = topics.find((topic) => topic.id === filters.topic)?.label;
  // By name while narrowed down; otherwise the list is newest first.
  const listHeading = filters.q ? "Search results" : (topicLabel ?? "Latest blogs");

  const chooseTopic = (topic: string | null) => (event: MouseEvent) => {
    if (!onChange || !isPlainClick(event)) return;
    event.preventDefault();
    onChange({ ...filters, topic, page: 1 }, "replace");
  };

  const clearAll = (event: MouseEvent) => {
    if (!onChange || !isPlainClick(event)) return;
    event.preventDefault();
    onChange(EMPTY_BLOG_FILTERS, "replace");
  };

  return (
    <section aria-label="All blogs" id={LIST_ID} className="wrap flex flex-col gap-7 py-10 md:py-14">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {topics.length > 1 && (
            <ul aria-label="Blog topics" className="flex flex-wrap gap-2">
              {[{ id: null, label: "All" }, ...topics].map(({ id, label }) => {
                const isCurrent = filters.topic === id;
                return (
                  <li key={label}>
                    <a
                      href={hrefOf({ ...filters, topic: id, page: 1 })}
                      aria-current={isCurrent ? "true" : undefined}
                      onClick={chooseTopic(id)}
                      className={`${CHIP} ${isCurrent ? "border-navy bg-navy text-snow hover:text-snow" : "border-line bg-snow text-ink hover:border-navy hover:text-navy"}`}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <BlogSearchBox value={filters.q} onSearch={onChange && ((q) => onChange({ ...filters, q: q.trim(), page: 1 }, "replace"))} />
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-[22px]! leading-7.5!">{listHeading}</h2>
          <p role="status" className="text-[15px] leading-5.75 text-muted">
            {statusLine(total, filters.q, topicLabel, page, pageCount)}
          </p>
        </div>
        {total === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-cloud p-6 md:p-8">
            <h3>No blogs found</h3>
            <p>{isFiltering ? "Try a shorter word, or look through all of them." : "New blogs will be listed here."}</p>
            {isFiltering && (
              <a href={ROUTES.blogs} onClick={clearAll} className={`${CHIP} border-navy bg-navy text-snow hover:text-snow`}>
                See all blogs
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((guide, index) => (
              <GuideCard key={guide.slug} guide={guide} isPriority={index === 0} />
            ))}
          </div>
        )}
      </div>
      <BlogPagination
        page={page}
        pageCount={pageCount}
        hrefFor={(number) => hrefOf({ ...filters, page: number })}
        onChoose={
          onChange &&
          ((number) => {
            onChange({ ...filters, page: number }, "push");
            document.getElementById(LIST_ID)?.scrollIntoView();
          })
        }
      />
    </section>
  );
};

type BlogExplorerProps = { guides: readonly HomeGuide[] };

/** The blogs with search, topics and pages, following the address. */
export const BlogExplorer = ({ guides }: BlogExplorerProps) => {
  const { filters, go } = useBlogFilters(blogTopics(guides).map((topic) => topic.id));
  return <BlogExplorerView guides={guides} filters={filters} onChange={go} />;
};

/** The pre-rendered version (no address yet): page 1 of every blog, with links that load their address. */
export const BlogExplorerStatic = ({ guides }: BlogExplorerProps) => <BlogExplorerView guides={guides} filters={EMPTY_BLOG_FILTERS} />;
