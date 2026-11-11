import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { removeAdventure } from "@/features/adventures/actions/removeAdventure";
import { saveAdventure } from "@/features/adventures/actions/saveAdventure";
import { saveAdventureSection } from "@/features/adventures/actions/saveAdventureSection";
import { AdventurePanel } from "@/features/adventures/components/AdventurePanel";
import { AdventuresOverview } from "@/features/adventures/components/AdventuresOverview";
import { ADVENTURE_LIMITS, EMPTY_ADVENTURE_VALUES, SAVED_NOTICES } from "@/features/adventures/constants";
import { getAdventureSection, listAdventures } from "@/features/adventures/services/adventuresRepository";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";

export const metadata: Metadata = { title: ADMIN_SECTIONS.adventures.label };

/**
 * Adventures of the website "Working on" shows (each website has its own): its home page's custom adventures section,
 * its words and its cards. "?adventure=<id>" opens a card's
 * edit panel beside the list, "?adventure=new" an empty one; "?saved=…" says what the last save did.
 */
const AdventuresPage = async ({ searchParams }: PageProps<"/adventures">) => {
  const admin = await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  const [adventures, section, { adventure: openParam, saved }] = await Promise.all([listAdventures(site.id), getAdventureSection(site.id), searchParams]);

  const openId = typeof openParam === "string" ? openParam : null;
  const open = adventures.find((adventure) => adventure.id === openId) ?? null;
  const isAdding = openId === "new";
  // A new card goes last in the carousel.
  const nextPosition = Math.min(Math.max(0, ...adventures.map((adventure) => adventure.position)) + 1, ADVENTURE_LIMITS.position);

  const panel = (open || isAdding) && (
    <AdventurePanel
      // A fresh form for each card (nothing typed for one carries over to another).
      key={open?.id ?? "new"}
      action={saveAdventure.bind(null, site.id, open?.id ?? null)}
      adventure={open}
      values={open ?? { ...EMPTY_ADVENTURE_VALUES, position: nextPosition }}
      removeAction={open && admin.role === "super_admin" ? removeAdventure.bind(null, site.id, open.id) : null}
    />
  );

  const savedNotice = Object.entries(SAVED_NOTICES).find(([notice]) => notice === saved)?.[1] ?? null;

  return (
    <AdventuresOverview
      adventures={adventures}
      section={section}
      saveSectionAction={saveAdventureSection.bind(null, site.id)}
      openId={open?.id ?? (isAdding ? "new" : null)}
      panel={panel || null}
      savedNotice={panel ? null : savedNotice}
    />
  );
};

export default AdventuresPage;
