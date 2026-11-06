"use client";

import { useEffect, useRef } from "react";

import { useActiveSection } from "@/hooks/useActiveSection";

type PageSectionLinksProps = { links: readonly { id: string; label: string }[] };

/** The menu of a page's sections, in page order: jumps to each, and underlines the one being read. Scrolls sideways on a phone. */
export const PageSectionLinks = ({ links }: PageSectionLinksProps) => {
  const { active, jumpTo } = useActiveSection(links.map((link) => link.id));
  const nav = useRef<HTMLElement>(null);

  // On a phone the list scrolls sideways: keep the marked link in view, without moving the page.
  useEffect(() => {
    const list = nav.current;
    const link = active ? list?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (list && link) list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2 });
  }, [active]);

  return (
    <nav ref={nav} aria-label="On this page" className="relative min-w-0 scroll-smooth overflow-x-auto motion-reduce:scroll-auto">
      <ul className="flex gap-7 text-[15px] font-semibold whitespace-nowrap">
        {links.map((link) => {
          const isActive = link.id === active;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => jumpTo(link.id)}
                className={`inline-flex min-h-15 items-center no-underline hover:text-forest focus-visible:-outline-offset-2 ${isActive ? "text-forest shadow-[inset_0_-3px_0_var(--color-forest)]" : "text-muted"}`}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
