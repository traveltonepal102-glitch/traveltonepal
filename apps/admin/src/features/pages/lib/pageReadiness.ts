import type { SectionReadiness } from "@/components/editor/types";
import { isRichTextEmpty } from "@/lib/richText/richText";

import { legalTextToPlainText } from "@/lib/richText/legalText";

import { LEGAL_PAGES, LIST_PAGES, PROMISE_ROWS, RECOMMENDED_CONTACT_FAQS } from "../constants";
import type { LegalPageSlug, ListPageSlug } from "../constants";
import type { AboutSectionKey, ContactSectionKey } from "../sections";
import type { AboutBelief } from "../aboutTypes";
import type { AboutFacts, AboutPageValues, AboutTeamPerson, ContactPageValues, LegalPagesValues, ListPagesValues, PageTopValues } from "../types";

const done = (note: string): SectionReadiness => ({ status: "done", note });
const warn = (note: string): SectionReadiness => ({ status: "warn", note });
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const googleReadiness = (top: PageTopValues) =>
  top.seoKeyword && top.seoTitle && top.seoDescription ? done("Title and description") : warn("Keyword, title or description missing");

const filled = (items: readonly { title: string }[]) => items.filter((item) => item.title.trim()).length;

/** A belief is ready with its card and its section's heading and text. */
const beliefReadiness = (belief: AboutBelief) =>
  belief.heading && belief.body && belief.cardTitle ? done("Card and section") : warn("Card, heading or text missing");

/** Each About section's status in the editor's menu, from what is saved. */
export const aboutReadiness = (values: AboutPageValues, team: readonly AboutTeamPerson[], facts: AboutFacts): Partial<Record<AboutSectionKey, SectionReadiness>> => {
  const shown = team.filter((person) => person.isShown);
  const office = shown.filter((person) => person.group === "office").length;
  const promises = values.promises.length;
  const certificates = Number(facts.hasCertificate) + Number(facts.hasPanCertificate);
  return {
    top: values.heading && values.intro ? done("Heading, text, 4 numbers") : warn("Heading or text missing"),
    listen: beliefReadiness(values.listen),
    honest: beliefReadiness(values.honest),
    flexible: beliefReadiness(values.flexible),
    openMind: beliefReadiness(values.openMind),
    safety: values.safety.heading ? done(plural(filled(values.safety.facts), "fact")) : warn("Heading missing"),
    story: isRichTextEmpty(values.storyText) || !values.founderAuthorId ? warn("Founder or story missing") : done(`Founder, ${plural(filled(values.goals), "goal")}`),
    team: shown.length ? done(`${office} office · ${shown.length - office} guides`) : warn("No one shown yet"),
    licences: !facts.licences.length ? warn("Numbers missing") : certificates === 2 ? done(plural(facts.licences.length, "number")) : warn(`${certificates} of 2 certificates`),
    promises: promises === PROMISE_ROWS ? done(plural(promises, "promise")) : warn(`${plural(promises, "promise")} of ${PROMISE_ROWS}`),
    seo: googleReadiness(values),
  };
};

/** Each Contact section's status in the editor's menu, from what is saved. */
export const contactReadiness = (values: ContactPageValues): Partial<Record<ContactSectionKey, SectionReadiness>> => ({
  top: values.heading && values.intro ? done("Heading and text") : warn("Text missing"),
  ways: values.replyWhatsApp && values.replyEmail ? done("Reply times") : warn("Reply time missing"),
  steps: values.nextSteps.length ? done(plural(values.nextSteps.length, "step")) : warn("No steps"),
  office: values.timeZones.length ? done(plural(values.timeZones.length, "place")) : warn("No places picked"),
  faq: values.faqs.length >= RECOMMENDED_CONTACT_FAQS ? done(plural(values.faqs.length, "question")) : warn(plural(values.faqs.length, "question")),
  seo: googleReadiness(values),
});

/** Each list page's status in the list editor's menu: its address while the top and Google result are complete. */
export const listReadiness = (values: ListPagesValues): Partial<Record<ListPageSlug, SectionReadiness>> =>
  Object.fromEntries(
    LIST_PAGES.map((page) => {
      const top = values[page.slug];
      const isComplete = top.heading && top.intro && top.seoKeyword && top.seoTitle && top.seoDescription;
      return [page.slug, isComplete ? done(page.websitePath) : warn("Text or Google result missing")];
    }),
  );

/** "[DATE]", "[NUMBER]"…: a gap in the text still waiting for a real detail. */
const BRACKET_GAP = /\[[A-Z][A-Z0-9 ,.:/()-]*\]/;

/** Each legal page's status in the legal editor's menu: brackets to fill in, then the lawyer's check. */
export const legalReadiness = (values: LegalPagesValues): Partial<Record<LegalPageSlug, SectionReadiness>> =>
  Object.fromEntries(
    LEGAL_PAGES.map((page) => {
      const legal = values[page.slug];
      if (BRACKET_GAP.test(legalTextToPlainText(legal.body))) return [page.slug, warn("Fill in the [brackets]")];
      return [page.slug, legal.lawyerChecked ? done("Checked by a lawyer") : warn("Not checked by a lawyer")];
    }),
  );
