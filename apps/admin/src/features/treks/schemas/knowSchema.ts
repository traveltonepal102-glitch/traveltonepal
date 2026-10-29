import { z } from "zod";

import { readList, text } from "@/lib/forms/formFields";
import { isRichTextEmpty, richTextField } from "@/lib/richText/richText";

import { KNOW_ICON_VALUES, MAX_KNOW_TOPICS, TREK_LIMITS as LIMIT } from "../constants";

/** A topic needs its heading and its text (or note); a fully empty topic is ignored. */
const knowTopicSchema = z
  .object({
    icon: z.enum(KNOW_ICON_VALUES, "Pick an icon."),
    title: text(LIMIT.heading),
    body: richTextField(LIMIT.knowText),
    note: text(LIMIT.knowNote),
    // "photo:<photo id>", "video:<youtube id>" or "" (none), from the topic's media menu.
    media: z.string().regex(/^(photo:[0-9a-f-]{36}|video:[\w-]{11})?$/, "Pick the photo or video again."),
  })
  .superRefine((topic, context) => {
    if (Boolean(topic.title) === (!isRichTextEmpty(topic.body) || Boolean(topic.note))) return;
    if (topic.title) context.addIssue({ code: "custom", path: ["body"], message: "Write the topic's text, or remove this topic." });
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

/** Topics in FormData: knowIcon / knowTitle / knowBody / knowNote / knowMedia, one of each per topic. */
export const readKnowTopics = (formData: FormData) => {
  const [icons, bodies, notes, media] = ["knowIcon", "knowBody", "knowNote", "knowMedia"].map((name) => readList(formData, name));
  return readList(formData, "knowTitle").map((title, index) => ({
    icon: icons[index] ?? "",
    title,
    body: bodies[index] ?? "",
    note: notes[index] ?? "",
    media: media[index] ?? "",
  }));
};
