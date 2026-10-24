import { createHash, timingSafeEqual } from "node:crypto";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import type { WebsiteCacheTag } from "@ttn/config/websiteCache";
import { z } from "zod";

const BEARER = "Bearer ";

// Hashing first gives both sides the same length, so the comparison takes the same time whatever was sent.
const digest = (value: string) => createHash("sha256").update(value).digest();

/** True when the Authorization header carries the shared secret ("Bearer <secret>"). */
export const isAuthorizedRefresh = (authorization: string | null, secret: string) =>
  authorization?.startsWith(BEARER) === true && timingSafeEqual(digest(authorization.slice(BEARER.length)), digest(secret));

const refreshBodySchema = z.object({
  tags: z.array(z.enum(WEBSITE_CACHE_TAGS)).min(1).max(Object.keys(WEBSITE_CACHE_TAGS).length * 2),
});

/** The tags a refresh request asks for, each once; null when the body isn't { tags: [known tags] }. */
export const readRefreshTags = (body: unknown): WebsiteCacheTag[] | null => {
  const parsed = refreshBodySchema.safeParse(body);
  return parsed.success ? [...new Set(parsed.data.tags)] : null;
};
