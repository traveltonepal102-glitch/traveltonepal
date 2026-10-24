import { z } from "zod";

import { readList, text } from "@/lib/forms/formFields";

import { KNOW_ICON_VALUES, MAX_KNOW_POINTS, MAX_KNOW_TOPICS, TREK_LIMITS as LIMIT } from "../constants";
import { pointsSchema, readPoints } from "./pointsSchema";

/** A topic needs its heading and at least one point; a fully empty topic is ignored. */
const knowTopicSchema = z
  .object({
    icon: z.enum(KNOW_ICON_VALUES, "Pick an icon."),
    title: text(LIMIT.heading),
    points: pointsSchema(MAX_KNOW_POINTS),
    note: text(LIMIT.knowNote),
    // "photo:<photo id>", "video:<youtube id>" or "" (none), from the topic's media menu.
    media: z.string().regex(/^(photo:[0-9a-f-]{36}|video:[\w-]{11})?$/, "Pick the photo or video again."),
  })
  .superRefine((topic, context) => {
    if (Boolean(topic.title) === Boolean(topic.points.length || topic.note)) return;
    if (topic.title) context.addIssue({ code: "custom", path: ["points"], message: "Add at least one point, or remove this topic." });
    else context.addIssue({ code: "custom", path: ["title"], message: "Write the topic's heading, or remove this topic." });
  })
  .transform(({ media, ...topic }) => ({
    ...topic,
    photoId: media.startsWith("photo:") ? media.slice(6) : null,
    videoId: media.startsWith("video:") ? media.slice(6) : null,
  }));

/** "Trek guide: season, facilities and safety" topics, in order. Errors keep the topic's number. */
export const knowTopicsSchema = z
  .array(knowTopicSchema)
  .transform((topics) => topics.filter((topic) => topic.title))
  .refine((topics) => topics.length <= MAX_KNOW_TOPICS, `Keep it to ${MAX_KNOW_TOPICS} topics.`);

/** Topics in FormData: knowIcon / knowTitle / knowNote / knowMedia per topic, points as know<topic>Title/Text. */
export const readKnowTopics = (formData: FormData) => {
  const [icons, notes, media] = ["knowIcon", "knowNote", "knowMedia"].map((name) => readList(formData, name));
  return readList(formData, "knowTitle").map((title, index) => ({
    icon: icons[index] ?? "",
    title,
    points: readPoints(formData, `know${index}`),
    note: notes[index] ?? "",
    media: media[index] ?? "",
  }));
};
