import { Icon } from "@ttn/ui/icon";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";

import { deleteSite } from "../actions/deleteSite";
import type { Site } from "../types";

/** Why a site can't be deleted now, or null when it can (a draft region site). */
const blockedReason = (site: Site) => {
  if (site.kind === "main") return "The main site can't be deleted.";
  if (site.isLive) return "This site is live, so it can't be deleted. Switch Live off and save first.";
  return null;
};

/** "Delete this website" (Super admins): only a draft region site; a live one or the main site says why not. */
export const DeleteSiteCard = ({ site }: { site: Site }) => {
  const reason = blockedReason(site);

  return (
    <section aria-labelledby="delete-site" className="flex flex-wrap items-center gap-3 rounded-lg border border-solid border-[#fecaca] bg-surface p-5">
      <div className="min-w-60 flex-1">
        <h2 id="delete-site" className="m-0 font-display text-h4 text-ink">
          Delete this website
        </h2>
        <p className="m-0 mt-1 flex items-start gap-1.5 text-body-sm text-text">
          {reason && <Icon name="lock" size={18} className="flex-none text-muted-foreground" />}
          {reason ?? "Removes the site from the admin for good. Remove its Vercel project and domain there as well."}
        </p>
      </div>
      {!reason && (
        <ConfirmRemoveButton
          name={site.name}
          verb="delete"
          consequence="It leaves “Working on”. Its Vercel project and domain stay until you remove them there."
          action={deleteSite.bind(null, site.id)}
        />
      )}
    </section>
  );
};
