import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  /** Leave out for the current page (the last item), or for a group with no page of its own (e.g. "Legal"). */
  href?: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  /** "onDark" for page heroes on a photo or navy; "default" on light backgrounds. */
  tone?: "default" | "onDark";
};

const TONES = {
  default: { list: "text-muted-foreground", current: "text-ink", focus: "focus-visible:outline-ring" },
  onDark: { list: "text-navy-text", current: "text-white", focus: "focus-visible:outline-white" },
} as const;

/** Page breadcrumb trail, e.g. Home / Treks. The last item is the current page. */
export const Breadcrumbs = ({ items, tone = "default" }: BreadcrumbsProps) => {
  const look = TONES[tone];

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-2 text-xs ${look.list}`}>
        {items.map((item, index) => (
          <li key={item.label} className="inline-flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="opacity-50">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={`rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${look.focus}`}
              >
                {item.label}
              </Link>
            ) : index === items.length - 1 ? (
              <span aria-current="page" className={`font-semibold ${look.current}`}>
                {item.label}
              </span>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
