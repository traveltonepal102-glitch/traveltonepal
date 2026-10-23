import { Icon } from "@ttn/ui/icon";

import { signOut } from "../actions/signOut";

/**
 * Icon button for the navy sidebar. A form, so signing out works without JavaScript and can't be
 * triggered by simply opening a link.
 */
export const SignOutButton = () => (
  <form action={signOut} className="flex flex-none">
    <button
      type="submit"
      aria-label="Sign out"
      title="Sign out"
      className="m-0 inline-flex size-8.5 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-navy-text hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-sidebar-ring"
    >
      <Icon name="logout" />
    </button>
  </form>
);
