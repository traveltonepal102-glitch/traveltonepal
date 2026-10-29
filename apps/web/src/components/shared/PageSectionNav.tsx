export type PageSectionLink = { id: string; label: string };

type PageSectionNavProps = {
  links: readonly PageSectionLink[];
  /** Space above the bar, e.g. "mt-7". */
  className?: string;
};

/**
 * Sticky "On this page" bar of a long page (region and About pages): one tab per section, page-grey under a line.
 * Scrolls sideways on phones.
 */
export const PageSectionNav = ({ links, className = "" }: PageSectionNavProps) => (
  <nav aria-label="On this page" className={`sticky top-0 z-30 border-b border-line bg-page/95 backdrop-blur-md ${className}`}>
    <div className="mx-auto flex w-full max-w-content gap-1 relative overflow-x-auto px-4 scrollbar-none md:px-6 [&::-webkit-scrollbar]:hidden">
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="flex-none border-b-3 border-transparent px-3.5 pt-3.5 pb-3 text-body-sm font-bold whitespace-nowrap text-text hover:border-brand/40 hover:text-brand focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          {link.label}
        </a>
      ))}
    </div>
  </nav>
);
