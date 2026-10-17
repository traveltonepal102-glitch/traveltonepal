import Link from "next/link";

import { MORE_LINK } from "./styles";

type RegionSectionHeadingProps = {
  id: string;
  kicker: string;
  title: string;
  /** "See all →" link on the right, e.g. to all regions. */
  link?: { href: string; label: string };
  /** "dark" on the navy guides band. */
  tone?: "light" | "dark";
  isCentered?: boolean;
};

/** Kicker and H2 that open each region section, with an optional link beside them. */
export const RegionSectionHeading = ({ id, kicker, title, link, tone = "light", isCentered = false }: RegionSectionHeadingProps) => {
  const isDark = tone === "dark";

  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${isCentered ? "justify-center text-center" : ""}`}>
      <div className={`flex flex-col gap-1.5 ${isCentered ? "items-center" : ""}`}>
        <p className={`text-eyebrow uppercase ${isDark ? "text-saffron" : "text-brand"}`}>{kicker}</p>
        <h2 id={id} className={`text-h2-sm md:text-h2 ${isDark ? "text-white" : ""}`}>
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className={`${MORE_LINK} ${isDark ? "text-saffron focus-visible:outline-white" : "text-brand focus-visible:outline-ring"}`}
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
};
