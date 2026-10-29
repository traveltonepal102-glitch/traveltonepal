import { Switch } from "@/components/ui/Switch";

type HideFromGoogleFieldProps = {
  defaultChecked: boolean;
  /** Sent as this form field (lists of pages: one per page). */
  name?: string;
};

/**
 * "Hide from Google" in a Google card: the page stays on the website, but search engines are asked not to list it
 * (noindex, follow) and it leaves sitemap.xml.
 */
export const HideFromGoogleField = ({ defaultChecked, name = "hideFromGoogle" }: HideFromGoogleFieldProps) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-solid border-border p-3 hover:border-line-strong">
    <span className="min-w-0 flex-1">
      <span className="block font-bold text-ink">Hide from Google</span>
      <span className="block text-xs text-muted-foreground">
        The page stays on the website and its links keep working, but Google and other search engines won&apos;t list it, and it leaves the sitemap.
      </span>
    </span>
    <Switch name={name} label="Hide from Google" defaultChecked={defaultChecked} />
  </label>
);
