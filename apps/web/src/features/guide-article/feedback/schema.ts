import { z } from "zod";

import { GUIDE_ARTICLE_SLUGS } from "../guideArticles";

export const GUIDE_VOTES = ["yes", "no"] as const;
export type GuideVote = (typeof GUIDE_VOTES)[number];

/** "Was this guide helpful?" as the server accepts it: a guide that has a page, and yes or no. */
export const guideFeedbackSchema = z.object({
  slug: z.string().refine((slug) => GUIDE_ARTICLE_SLUGS.includes(slug), { error: "Unknown guide." }),
  vote: z.enum(GUIDE_VOTES),
});

export type GuideFeedback = z.output<typeof guideFeedbackSchema>;

export type GuideFeedbackResult = { status: "recorded" } | { status: "error"; message: string };
