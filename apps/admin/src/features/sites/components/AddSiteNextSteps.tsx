import { Icon } from "@ttn/ui/icon";

const STEPS = [
  "Developer: a Vercel project for the site, with SITE_ID set to its site id, and its design.",
  "You: pick the site in “Working on” and fill in its Settings (contact, company, Google profile).",
  "You: copy its treks from Travel To Nepal and rewrite their words, then its pages and travel guides.",
  "Add the domain, then switch the site live. Until then Google is told to skip it.",
];

/** The side card of "Add a site": what happens after adding, and what is never copied between sites. */
export const AddSiteNextSteps = () => (
  <aside className="flex flex-col gap-4">
    <section className="flex flex-col gap-3 rounded-lg border border-solid border-border bg-surface p-5">
      <h2 className="m-0 font-display text-h4 text-ink">After adding</h2>
      <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-body-sm text-text">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
    <section className="flex gap-2.5 rounded-lg border border-solid border-saffron-line bg-saffron-tint p-4 text-body-sm text-saffron-ink">
      <Icon name="info" size={20} className="flex-none" />
      <p className="m-0">
        Nothing is copied between sites by itself. Each site writes its own words, so Google sees it as its own website.
      </p>
    </section>
  </aside>
);
