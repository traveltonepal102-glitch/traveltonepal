"use client";

import { useId, useState } from "react";

type ReadMoreProps = {
  paragraphs: readonly string[];
  /** Classes for the "Read more" button. */
  buttonClassName: string;
};

/**
 * Shows the first paragraph and a "Read more" button for the rest. Every paragraph is in the HTML
 * from the start (only hidden), so search engines read the whole text.
 */
export const ReadMore = ({ paragraphs, buttonClassName }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const [first, ...rest] = paragraphs;

  return (
    <>
      <div id={contentId} className="flex flex-col gap-3">
        <p>{first}</p>
        {rest.map((paragraph) => (
          <p key={paragraph} hidden={!isExpanded}>
            {paragraph}
          </p>
        ))}
      </div>
      {rest.length > 0 && (
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
