import { Icon } from "@ttn/ui/icon";

type ReadReviewLinkProps = {
  /** The review itself on the review site. */
  url: string;
  /** e.g. "Google". */
  source: string;
  /** Who wrote it, so each link says which review it opens (screen readers list links by their text). */
  reviewer: string;
};

/** "Read more on Google": the whole review, with the trekker's photos, where it was posted. */
export const ReadReviewLink = ({ url, source, reviewer }: ReadReviewLinkProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 self-start rounded-sm text-caption font-bold text-brand underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    Read more on {source}
    <span className="sr-only">: the review by {reviewer}</span>
    <Icon name="open_in_new" size={16} />
  </a>
);
