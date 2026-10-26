import { z } from "zod";

export const GUIDE_VOTES = ["yes", "no"] as const;
export type GuideVote = (typeof GUIDE_VOTES)[number];

/** "Was this guide helpful?" as the server accepts it: a guide's address (letters, digits and dashes), and yes or no. */
export const guideFeedbackSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { error: "Unknown guide." }).max(100),
  vote: z.enum(GUIDE_VOTES),
});

export type GuideFeedback = z.output<typeof guideFeedbackSchema>;

export type GuideFeedbackResult = { status: "recorded" } | { status: "error"; message: string };
