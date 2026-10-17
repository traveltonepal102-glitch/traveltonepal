import { WRAP } from "./styles";

export type RegionSectionLink = { id: string; label: string };

/** Sticky "On this page" bar under the facts; scrolls sideways on phones. */
export const RegionSectionNav = ({ links }: { links: readonly RegionSectionLink[] }) => (
  <nav aria-label="On this page" className="sticky top-0 z-30 mt-7 border-b border-line bg-page/95 backdrop-blur-md">
    <div className={`${WRAP} flex gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden`}>
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
