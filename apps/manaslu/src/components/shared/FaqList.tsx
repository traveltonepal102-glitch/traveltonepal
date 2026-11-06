import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { RichText } from "./RichText";

/** Questions that open in place (no JavaScript); the first starts open. */
export const FaqList = ({ items }: { items: readonly { question: string; body: RichTextDoc }[] }) => (
  <div className="overflow-hidden rounded-[14px] border border-solid border-line">
    {items.map((item, index) => (
      <details key={item.question} open={index === 0} className="group -mt-px border-t border-solid border-line open:bg-stone">
        <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-[17px] leading-6 font-semibold text-ink">
          {item.question}
          <span aria-hidden="true" className="inline-flex size-7 flex-none items-center justify-center rounded-full bg-forest-tint font-semibold text-forest">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <RichText doc={item.body} className="flex flex-col gap-3 px-5 pb-4.5" />
      </details>
    ))}
  </div>
);
