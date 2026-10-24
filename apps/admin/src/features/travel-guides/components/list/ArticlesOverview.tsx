"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";
import { inputClass } from "@/components/ui/formStyles";

import { ARTICLE_STATUSES, ARTICLE_TOPICS, NEW_ARTICLE_PATH } from "../../constants";
import type { ArticleListItem } from "../../lib/articleListItem";
import { NO_ARTICLE_FILTERS, filterArticles } from "../../lib/articleListItem";
import type { ArticleOptions } from "../../types";
import { ArticleRows } from "./ArticleRows";

type ArticlesOverviewProps = {
  articles: ArticleListItem[];
  sites: ArticleOptions["sites"];
  authors: ArticleOptions["authors"];
  /** "YYYY-MM-DD" in Nepal. */
  today: string;
};

const selectClass = cn(inputClass, "w-auto min-w-40 cursor-pointer pr-8");
const topicOf = (value: string) => ARTICLE_TOPICS.find((topic) => topic.value === value)?.value ?? "";
const statusOf = (value: string) => ARTICLE_STATUSES.find((status) => status.value === value)?.value ?? "";

/** The Travel guides screen: heading, "Add travel guide", filters and the list (most recently edited first). */
export const ArticlesOverview = ({ articles, sites, authors, today }: ArticlesOverviewProps) => {
  const [filters, setFilters] = useState(NO_ARTICLE_FILTERS);
  const shown = filterArticles(articles, filters);
  const siteName = (id: string | null) => (id ? (sites.find((site) => site.id === id)?.name ?? "") : "Travel To Nepal (main)");
  const authorName = (id: string | null) => authors.find((author) => author.id === id)?.name ?? "";

  return (
    <>
      <div className="flex flex-wrap items-start gap-3.5">
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Icon name="article" size={26} />
        </span>
        <div className="min-w-60 flex-1">
          <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
            Travel guides
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{articles.length}</span>
          </h1>
          <p className="m-0 mt-1 max-w-195 text-muted-foreground">Practical guides for planning a trek: seasons, permits, health and gear. Each belongs to one website.</p>
        </div>
        <Link href={NEW_ARTICLE_PATH} className={primaryButton}>
          <Icon name="add" />
          Add travel guide
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 max-tablet:flex-col max-tablet:items-stretch">
        <label className="relative block min-w-55 flex-1 tablet:max-w-90">
          <span className="sr-only">Search travel guides</span>
          <Icon name="search" size={20} className="pointer-events-none absolute top-2.5 left-3 text-muted-foreground" />
          <input type="search" value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Search by title" className={cn(inputClass, "pl-10.5")} />
        </label>
        <select aria-label="Filter by website" value={filters.site} onChange={(event) => setFilters({ ...filters, site: event.target.value })} className={selectClass}>
          <option value="all">All websites</option>
          <option value="main">Travel To Nepal (main)</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
        <select aria-label="Filter by topic" value={filters.topic} onChange={(event) => setFilters({ ...filters, topic: topicOf(event.target.value) })} className={selectClass}>
          <option value="">All topics</option>
          {ARTICLE_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
        <select aria-label="Filter by status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: statusOf(event.target.value) })} className={selectClass}>
          <option value="">Any status</option>
          {ARTICLE_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <span className="flex-1 max-tablet:hidden" />
        <span role="status" className="text-xs text-muted-foreground">
          Showing {shown.length} of {articles.length}
        </span>
      </div>

      {shown.length ? (
        <ArticleRows articles={shown} siteName={siteName} authorName={authorName} today={today} />
      ) : (
        <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-muted-foreground">
          {articles.length ? "No travel guide matches these filters." : "No travel guides yet. Add the first one with “Add travel guide”."}
        </p>
      )}
    </>
  );
};
