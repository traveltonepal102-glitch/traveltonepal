import type { TopicLink } from "../navigation";
import { MenuItemLink, PanelCard, PanelFooter } from "./MenuParts";

type TopicsMenuProps = {
  links: readonly TopicLink[];
  allLabel: string;
  allHref: string;
  /** Where the narrow card sits under the header: under its tab. */
  align: "center" | "end";
};

/** Narrow two-column menu, used for Travel guides and About us. */
export const TopicsMenu = ({ links, allLabel, allHref, align }: TopicsMenuProps) => (
  <div className={`flex ${align === "end" ? "justify-end" : "justify-center"}`}>
    <PanelCard className="w-140 max-w-full p-5">
      <div className="grid grid-cols-2 gap-2.5">
        {links.map((link) => (
          <MenuItemLink key={link.href} {...link} />
        ))}
      </div>
      <PanelFooter linkLabel={allLabel} href={allHref} />
    </PanelCard>
  </div>
);
