import { Icon } from "@ttn/ui/icon";
import Form from "next/form";

import { ROUTES } from "@/lib/routes";

import { ALL_GUIDES_ID } from "../guideFiltering";

/**
 * Search box on the Travel guides hero. A plain GET form to /travel-guides?q=…#all-guides (works
 * before JavaScript loads) that lands on the "All guides" results; next/form adds client-side navigation.
 */
export const GuideSearchForm = () => (
  <Form
    action={`${ROUTES.guides}#${ALL_GUIDES_ID}`}
    role="search"
    className="flex w-full items-center gap-2.5 rounded-lg border border-line-strong bg-surface py-1.5 pr-1.5 pl-4 transition-colors focus-within:border-brand focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring lg:max-w-107 lg:flex-none"
  >
    <Icon name="search" className="flex-none text-muted-foreground" />
    <label htmlFor="guide-search" className="sr-only">
      Search travel guides
    </label>
    {/* 16px text: smaller makes iPhones zoom in when the field is tapped. */}
    <input
      id="guide-search"
      name="q"
      type="search"
      placeholder="Search guides, e.g. permits"
      className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-foreground"
    />
    <button
      type="submit"
      className="inline-flex min-h-10.5 flex-none cursor-pointer items-center rounded-md bg-brand px-4.5 font-bold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      Search
    </button>
  </Form>
);
