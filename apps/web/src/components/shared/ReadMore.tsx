"use client";

import { useId, useState } from "react";
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
 * Shows the start of a text and a "Read more" button for the rest. The rest is in the HTML from the start (only
 * hidden), so search engines read the whole text.
 */
export const ReadMore = ({ children, more, buttonClassName }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  return (
    <>
      <div id={contentId} className="flex flex-col gap-3">
        {children}
        {more && <div hidden={!isExpanded}>{more}</div>}
      </div>
      {more && (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((current) => !current)}
          className={`self-start ${buttonClassName}`}
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </>
  );
};
