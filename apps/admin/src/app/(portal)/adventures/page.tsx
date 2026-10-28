import type { Metadata } from "next";

import { saveAdventure } from "@/features/adventures/actions/saveAdventure";
import { AdventurePanel } from "@/features/adventures/components/AdventurePanel";
import { AdventuresOverview } from "@/features/adventures/components/AdventuresOverview";
import { ADVENTURE_LIMITS, EMPTY_ADVENTURE_VALUES, SAVED_NOTICES } from "@/features/adventures/constants";
import { getAdventureSection, listAdventures } from "@/features/adventures/services/adventuresRepository";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { listLibraryPhotos } from "@/features/photos/services/photosRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const metadata: Metadata = { title: ADMIN_SECTIONS.adventures.label };

/**
 * Adventures: the home page's custom adventures section, its words and its cards. "?adventure=<id>" opens a card's
 * edit panel beside the list, "?adventure=new" an empty one; "?saved=…" says what the last save did.
 */
const AdventuresPage = async ({ searchParams }: PageProps<"/adventures">) => {
  const admin = await requireAdmin();
  const [adventures, section, { adventure: openParam, saved }] = await Promise.all([listAdventures(), getAdventureSection(), searchParams]);

  const openId = typeof openParam === "string" ? openParam : null;
  const open = adventures.find((adventure) => adventure.id === openId) ?? null;
  const isAdding = openId === "new";
  // The library is only needed with the panel open.
  const libraryPhotos = open || isAdding ? await listLibraryPhotos() : [];
  // A new card goes last in the carousel.
  const nextPosition = Math.min(Math.max(0, ...adventures.map((adventure) => adventure.position)) + 1, ADVENTURE_LIMITS.position);

  const panel = (open || isAdding) && (
    <AdventurePanel
      // A fresh form for each card (nothing typed for one carries over to another).
      key={open?.id ?? "new"}
      action={saveAdventure.bind(null, open?.id ?? null)}
      adventure={open}
      values={open ?? { ...EMPTY_ADVENTURE_VALUES, position: nextPosition }}
      libraryPhotos={libraryPhotos}
      canRemove={admin.role === "super_admin"}
    />
  );

  const savedNotice = Object.entries(SAVED_NOTICES).find(([notice]) => notice === saved)?.[1] ?? null;

  return (
    <AdventuresOverview
      adventures={adventures}
      section={section}
      openId={open?.id ?? (isAdding ? "new" : null)}
      panel={panel || null}
      savedNotice={panel ? null : savedNotice}
    />
  );
};

export default AdventuresPage;
