import { Icon } from "@ttn/ui/icon";

export type ReviewCardData = {
  key: string;
  quote: string;
  name: string;
  /** "Country · Trek" line under the name. */
  meta: string;
  /** Public page of the review. */
  cite?: string;
};

export const ReviewCard = ({ quote, name, meta, cite }: Omit<ReviewCardData, "key">) => (
  <figure className="flex h-full flex-col gap-4 rounded-xl bg-surface p-7">
    <Icon name="format_quote" size={36} className="text-chart-3" />
    <blockquote cite={cite} className="text-body-lg text-ink">
      {quote}
    </blockquote>
    <figcaption className="mt-auto flex items-center gap-3">
      <span className="inline-flex size-11 flex-none items-center justify-center rounded-full bg-brand-tint text-brand">
        <Icon name="hiking" size={22} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-bold text-ink">{name}</span>
        <span className="text-caption font-normal text-muted-foreground">{meta}</span>
      </span>
    </figcaption>
  </figure>
);
