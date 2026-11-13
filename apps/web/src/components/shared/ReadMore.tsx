import type { ReactNode } from "react";

type ReadMoreProps = {
  /** Always shown, e.g. the first paragraph. */
  children: ReactNode;
  /** Shown after "Read more"; nothing means no button. */
  more?: ReactNode;
  /** Classes for the "Read more" button. */
  buttonClassName: string;
};

/**
 * Shows the start of a text and "Read more" for the rest: a native <details>, so it needs no script, the rest is in the
 * HTML from the start, and the browser opens it by itself when "find in page" or a link from a search result lands on
 * words inside it (what `hidden="until-found"` does, which React can't write). The button stays under the text, open
 * or closed (`order-last`; a browser that can't reorder a <details> shows it above the rest instead).
 */
export const ReadMore = ({ children, more, buttonClassName }: ReadMoreProps) => (
  <div className="flex flex-col gap-3">
    {children}
    {more && (
      <details className="group flex flex-col gap-3">
        <summary className={`order-last list-none self-start [&::-webkit-details-marker]:hidden ${buttonClassName}`}>
          <span className="group-open:hidden">Read more</span>
          <span className="hidden group-open:inline">Show less</span>
        </summary>
        {more}
      </details>
    )}
  </div>
);
