import { NAV_GROUPS, isActivePath } from "../navigation";
import { SidebarNavLink } from "./SidebarNavLink";

type SidebarNavProps = {
  pathname: string;
  onNavigate: () => void;
};

/** The grouped menu (Content, People, Growth). Scrolls on its own when the window is short. */
export const SidebarNav = ({ pathname, onNavigate }: SidebarNavProps) => (
  <nav
    aria-label="Main"
    className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3.5 pt-1 pb-4 rail:gap-2.5 rail:px-3"
  >
    {NAV_GROUPS.map((group, index) => {
      const titleId = group.title ? `nav-group-${index}` : undefined;
      return (
        <div
          key={group.title ?? "start"}
          className="flex flex-col gap-0.5 rail:not-first:border-t rail:not-first:border-solid rail:not-first:border-sidebar-border rail:not-first:pt-2.5"
        >
          {group.title && (
            <p
              id={titleId}
              className="m-0 px-3 pb-1 text-[11px] font-bold tracking-widest text-navy-label uppercase rail:sr-only"
            >
              {group.title}
            </p>
          )}
          <ul aria-labelledby={titleId} className="m-0 flex list-none flex-col gap-0.5 p-0">
            {group.items.map((section) => (
              <li key={section.href}>
                <SidebarNavLink
                  section={section}
                  isActive={isActivePath(pathname, section.href)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    })}
  </nav>
);
