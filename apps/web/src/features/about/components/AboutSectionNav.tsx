"use client";

import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { useActiveSection } from "@/hooks/useActiveSection";

import type { AboutSectionLink } from "../sections";
import { FOCUS, WRAP } from "./styles";

/** Sticky "On this page" menu that marks the section being read. Scrolls sideways on phones. */
export const AboutSectionNav = ({ links }: { links: readonly AboutSectionLink[] }) => {
  const activeId = useActiveSection(links.map((link) => link.id));

  return (
    <nav aria-label="On this page" className="sticky top-0 z-30 border-b border-line bg-surface/97 shadow-card backdrop-blur-sm">
      <div className={`${WRAP} flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none [&::-webkit-scrollbar]:hidden`}>
        {links.map((link) => {
          const isActive = link.id === activeId;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`border-b-3 px-3 py-3.5 text-body-sm font-bold transition-colors ${FOCUS} ${
                isActive ? "border-brand text-brand" : "border-transparent text-text hover:text-brand"
              }`}
            >
              {link.label}
            </a>
          );
        })}
        <a
          href={getWhatsAppUrl("Hello! I'd like to plan a trek with you.")}
          target="_blank"
          rel="noopener noreferrer"
          className={`ml-auto hidden flex-none items-center gap-1.5 rounded-full bg-whatsapp px-3.5 py-1.75 text-caption font-bold text-white hover:bg-whatsapp/90 sm:inline-flex ${FOCUS}`}
        >
          <Icon name="chat" size={16} />
          Plan my trek
        </a>
      </div>
    </nav>
  );
};
