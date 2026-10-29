import { TextField } from "@/components/ui/TextField";
import { CANONICAL_PATH_MAX } from "@/lib/seo/canonicalPath";

type CanonicalPathFieldProps = {
  defaultValue: string;
  error?: string;
  /** Sent as this form field (lists of pages: one per page). */
  name?: string;
};

/**
 * "Canonical address" in a Google card (checked by canonicalPathField): left empty, the page is its own main version.
 * The website follows an address only when it is a page it shows, and then leaves this page out of the sitemap.
 */
export const CanonicalPathField = ({ defaultValue, error, name = "canonicalPath" }: CanonicalPathFieldProps) => (
  <TextField
    name={name}
    label="Canonical address"
    labelNote="(optional)"
    hint="Leave empty in most cases. Only when this page says almost the same as another page of this website, type that page's address: Google then lists that page instead of this one. An address that isn't a page of the website is ignored."
    placeholder="/treks/everest-base-camp"
    defaultValue={defaultValue}
    maxLength={CANONICAL_PATH_MAX}
    error={error}
  />
);
