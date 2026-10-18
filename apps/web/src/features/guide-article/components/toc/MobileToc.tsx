import type { TocLink } from "../../guideArticles";
import { FOCUS } from "../styles";

/** Folded "In this guide" list at the top of the article, for screens without the side list. */
export const MobileToc = ({ links }: { links: readonly TocLink[] }) => (
  <details className="rounded-xl border border-line bg-page xl:hidden print:hidden">
    <summary className={`cursor-pointer rounded-xl px-4 py-3 font-bold text-ink ${FOCUS}`}>
      In this guide ({links.length} sections)
    </summary>
    <nav aria-label="In this guide" className="flex flex-col gap-1.5 px-4 pb-3">
      {links.map((link) => (
        <a key={link.id} href={`#${link.id}`} className={`rounded-sm py-0.5 text-body-sm text-brand hover:underline ${FOCUS}`}>
          {link.label}
        </a>
      ))}
    </nav>
  </details>
);
