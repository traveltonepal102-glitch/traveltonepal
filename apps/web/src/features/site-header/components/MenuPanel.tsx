"use client";

import type { ReactNode } from "react";

import type { MenuKey } from "../navigation";
import { menuPanelId, menuTabId, useHeaderMenu } from "./HeaderMenuProvider";

type MenuPanelProps = {
  menu: MenuKey;
  children: ReactNode;
};

/**
 * Desktop dropdown under the header. Always in the HTML (hidden when closed) so its links
 * are crawlable; the content is rendered on the server and passed in as children.
 */
export const MenuPanel = ({ menu, children }: MenuPanelProps) => {
  const { openMenu } = useHeaderMenu();

  return (
    <div
      id={menuPanelId(menu)}
      aria-labelledby={menuTabId(menu)}
      hidden={openMenu !== menu}
      className="absolute inset-x-0 top-full max-lg:hidden"
    >
      <div className="mx-auto max-w-content px-6">{children}</div>
    </div>
  );
};
