import { Icon } from "@ttn/ui/icon";

import { SignOutButton } from "@/features/auth/components/SignOutButton";

type SidebarUserProps = {
  name: string;
  roleLabel: string;
};

/** The signed-in admin at the bottom of the sidebar, with sign-out. */
export const SidebarUser = ({ name, roleLabel }: SidebarUserProps) => (
  <div className="mx-3.5 mb-4 flex items-center gap-2.5 rounded-xl bg-white/6 p-3 rail:mx-2.5 rail:flex-col rail:px-1 rail:py-2">
    <span
      title={`${name} · ${roleLabel}`}
      className="inline-flex size-9 flex-none items-center justify-center rounded-full bg-brand-tint text-brand"
    >
      <Icon name="person" />
    </span>
    <span className="min-w-0 flex-1 rail:sr-only">
      <span className="block truncate text-body-sm font-bold text-white">{name}</span>
      <span className="block text-xs text-navy-muted">{roleLabel}</span>
    </span>
    <SignOutButton />
  </div>
);
