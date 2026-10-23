import { Icon } from "@ttn/ui/icon";

import { signOut } from "../actions/signOut";

/** A form, so signing out works without JavaScript and can't be triggered by simply opening a link. */
export const SignOutButton = () => (
  <form action={signOut}>
    <button
      type="submit"
      className="m-0 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-solid border-border bg-surface px-3.5 font-sans text-body-sm font-semibold text-ink hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Icon name="logout" size={18} />
      Sign out
    </button>
  </form>
);
