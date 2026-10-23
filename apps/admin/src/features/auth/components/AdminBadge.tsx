import { Icon } from "@ttn/ui/icon";

/** "Admin portal" pill, on the photo (wide screens) and in the navy bar (phones). */
export const AdminBadge = () => (
  <span className="inline-flex items-center gap-2 rounded-full border border-solid border-white/28 bg-white/14 px-3.5 py-1.75 text-caption font-bold tracking-[0.02em] text-white">
    <Icon name="shield_person" size={16} className="text-saffron" />
    Admin portal
  </span>
);
