import { z } from "zod";

import { readList, text } from "@/lib/forms/formFields";

import { FAQ_ICON_VALUES, MAX_FAQ_QUESTIONS, MAX_FAQ_TOPICS, TREK_LIMITS as LIMIT } from "../constants";

/** A question needs its answer and the other way round; a fully empty row is ignored. */
const questionsSchema = z
  .array(
    z.object({ question: text(LIMIT.faqQuestion), answer: text(LIMIT.faqAnswer) }).superRefine((item, context) => {
      if (Boolean(item.question) === Boolean(item.answer)) return;
      const missing = item.question ? "answer" : "question";
      context.addIssue({ code: "custom", path: [missing], message: `Write the ${missing}, or remove this question.` });
    }),
  )
  .transform((items) => items.filter((item) => item.question))
  .refine((items) => items.length <= MAX_FAQ_QUESTIONS, `Keep it to ${MAX_FAQ_QUESTIONS} questions per topic.`);

const topicSchema = z
  .object({
    title: text(LIMIT.faqTopicTitle),
    icon: z.enum(FAQ_ICON_VALUES, "Pick an icon."),
    items: questionsSchema,
  })
  .superRefine((topic, context) => {
    if (Boolean(topic.title) === Boolean(topic.items.length)) return;
    if (topic.title) context.addIssue({ code: "custom", path: ["items"], message: "Add a question, or remove this topic." });
    else context.addIssue({ code: "custom", path: ["title"], message: "Write the topic's name, or remove this topic." });
  });

/** The trek's question topics, in order. An empty topic is ignored (errors keep the topic's number). */
export const faqsSchema = z
  .array(topicSchema)
  .transform((topics) => topics.filter((topic) => topic.title))
  .refine((topics) => topics.length <= MAX_FAQ_TOPICS, `Keep it to ${MAX_FAQ_TOPICS} topics.`);

/** Topics in FormData: faqTopicTitle / faqTopicIcon per topic, and its questions as faq<topic>Question/Answer. */
export const readFaqs = (formData: FormData) => {
  const icons = readList(formData, "faqTopicIcon");
  return readList(formData, "faqTopicTitle").map((title, index) => {
    const answers = readList(formData, `faq${index}Answer`);
    return {
      title,
      icon: icons[index] ?? "",
      items: readList(formData, `faq${index}Question`).map((question, row) => ({ question, answer: answers[row] ?? "" })),
    };
  });
};
