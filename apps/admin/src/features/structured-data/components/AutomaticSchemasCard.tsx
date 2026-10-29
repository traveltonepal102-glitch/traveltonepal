import { Icon } from "@ttn/ui/icon";

import { FormSection } from "@/components/ui/FormSection";

import { richResultsTestUrl } from "../constants";
import type { AutomaticSchema } from "../constants";

type AutomaticSchemasCardProps = {
  schemas: AutomaticSchema[];
  /** The live page, for Google's test; null when the website address isn't set up. */
  pageUrl: string | null;
};

/** What the website already writes on this page by itself, and Google's test for the whole page. */
export const AutomaticSchemasCard = ({ schemas, pageUrl }: AutomaticSchemasCardProps) => (
  <FormSection title="Added by the website" hint="Written from the page's content and kept up to date by itself. Nothing to do here.">
    <ul className="m-0 flex flex-wrap gap-2 p-0">
      {schemas.map((schema) => (
        <li key={schema.type} className="list-none rounded-full bg-muted px-2.5 py-1 text-caption text-text">
          <strong className="text-ink">{schema.type}</strong>
          {schema.when && <span className="text-muted-foreground"> · {schema.when}</span>}
        </li>
      ))}
    </ul>
    <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-text">
      <Icon name="info" size={18} className="flex-none text-brand" />
      After saving, check the page with Google&apos;s test (it reads the live website):
      <a href={richResultsTestUrl(pageUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-brand">
        Rich Results Test
        <Icon name="open_in_new" size={14} />
      </a>
    </p>
  </FormSection>
);
