import Link from "next/link";

type BreadcrumbsProps = { items: readonly { label: string; href?: string }[] };

/** Where the page sits: the last item is the page, and an item with no page of its own is plain text. */
export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className="text-sm leading-5 text-muted">
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-6 items-center text-muted no-underline hover:text-forest">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-semibold text-ink" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
