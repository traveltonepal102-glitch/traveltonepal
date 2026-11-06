import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { getSitePageRow } from "@/features/site-pages/services/sitePagesRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, createDatabaseClient } from "@/lib/database";

import { toAboutContent, toTeam } from "../aboutRows";
import type { AboutContent, TeamMember } from "../types";

/** The About page from Pages › About. Throws on a database error. */
export const getAboutContent = async (): Promise<AboutContent> => toAboutContent(await getSitePageRow("about"), photosPublicBaseUrl);

/** "Our guides and team": see `toTeam`. Cached, refreshed when a person or a trek is saved; throws when the database can't be read. */
export const listTeam = async (): Promise<TeamMember[]> => {
  "use cache";
  cacheTag(CACHE_TAGS.pages, CACHE_TAGS.trekkingGuides, CACHE_TAGS.treks);
  cacheLife(DATABASE_CACHE_LIFE);

  const client = createDatabaseClient();
  const [team, guides] = await Promise.all([client.from("web_about_team").select("*"), client.from("web_trek_guides").select("id")]);
  if (team.error) throw new Error(`Could not load the team: ${team.error.message}`);
  if (guides.error) throw new Error(`Could not load the trek guides: ${guides.error.message}`);
  return toTeam(team.data, new Set(guides.data.map((guide) => guide.id)), photosPublicBaseUrl);
};
