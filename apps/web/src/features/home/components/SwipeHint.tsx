import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

type SwipeHintProps = {
  text: string;
  linkLabel: string;
  href: string;
};

/** Phones only: under a swipe row, says it scrolls sideways and links to the full list. */
export const SwipeHint = ({ text, linkLabel, href }: SwipeHintProps) => (
  <div className="-mt-4.5 flex items-center justify-between gap-3 text-body-sm text-muted-foreground md:hidden">
    <span className="inline-flex items-center gap-1.5">
      <Icon name="swipe" />
      {text}
    </span>
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1 rounded-sm font-extrabold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {linkLabel}
      <Icon name="arrow_forward" size={18} />
    </Link>
  </div>
);
