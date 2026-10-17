import { Icon } from "@ttn/ui/icon";
import Form from "next/form";

import { ROUTES } from "@/lib/routes";

/**
 * Search box on the Treks page hero. A plain GET form to /treks?q=… (works before JavaScript
 * loads); next/form adds client-side navigation. The results section reads `q`.
 */
export const TrekSearchForm = () => (
  <Form
    action={ROUTES.treks}
    role="search"
    className="mt-2 flex max-w-140 items-center gap-2.5 rounded-lg bg-surface py-1.5 pr-1.5 pl-4 shadow-popover focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white"
  >
    <Icon name="search" className="flex-none text-muted-foreground" />
    <label htmlFor="trek-search" className="sr-only">
      Search treks
    </label>
    {/* 16px text: smaller makes iPhones zoom in when the field is tapped. */}
    <input
      id="trek-search"
      name="q"
      type="search"
      placeholder="Search a trek or place, e.g. Everest, Poon Hill"
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
