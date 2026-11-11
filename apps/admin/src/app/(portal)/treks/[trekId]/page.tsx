import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { listPhotosByIds } from "@/features/photos/services/photoPickerRepository";
import { toGuideOption } from "@/features/trekking-guides/lib/guideOptions";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { deleteTrek } from "@/features/treks/actions/deleteTrek";
import { saveTrek } from "@/features/treks/actions/saveTrek";
import { TREKS_PATH } from "@/features/treks/constants";
import { TrekEditor } from "@/features/treks/components/editor/TrekEditor";
import { toTrekBlockers } from "@/features/treks/lib/trekBlockers";
import { getTrekUsage } from "@/features/treks/services/trekDeletionRepository";
import { getTrek, listRegionOptions, listSimilarTrekOptions } from "@/features/treks/services/treksRepository";
import { trekFileUrl } from "@/lib/storage/trekFiles";
import { formatDateTime, todayInNepal } from "@/utils/formatDateTime";

type TrekPageProps = PageProps<"/treks/[trekId]">;

/** The trek, or a 404 for an id that isn't a trek (checked before asking the database). */
const loadTrek = async (params: TrekPageProps["params"]) => {
  const { trekId } = await params;
  if (!z.uuid().safeParse(trekId).success) notFound();
  const trek = await getTrek(trekId);
  if (!trek) notFound();
  return trek;
};

export const generateMetadata = async ({ params }: TrekPageProps): Promise<Metadata> => {
  await requireAdmin();
  return { title: (await loadTrek(params)).name };
};

/**
 * Edit a trek (design: Admin-trek-editor.dc.html). "?added=1" right after it was added, "?copied=1" after "Copy a trek". A trek of another website
 * than "Working on" shows (e.g. after switching) goes back to this website's Treks. A Super admin also gets "Delete",
 * which lists what still uses the trek instead while anything does.
 */
const TrekPage = async ({ params, searchParams }: TrekPageProps) => {
  const admin = await requireAdmin();
  const canDelete = admin.role === "super_admin";
  const { trekId } = await params;
  const [trek, site, regions] = await Promise.all([loadTrek(params), getCurrentSite(), listRegionOptions()]);
  if (trek.siteId !== site?.id) redirect(TREKS_PATH);
  const [similarOptions, guides, usage] = await Promise.all([
    listSimilarTrekOptions(trek.siteId, trekId),
    listTrekkingGuides(trek.siteId),
    canDelete ? getTrekUsage(trek.id) : [],
  ]);
  // A topic's photo can be any library photo, not only the trek's: loaded for its preview.
  const topicPhotos = await listPhotosByIds(trek.knowTopics.flatMap((topic) => (topic.photoId ? [topic.photoId] : [])));
  const today = todayInNepal();
  const { added, copied } = await searchParams;

  return (
    <TrekEditor
      action={saveTrek.bind(null, trek.siteId, trek.id)}
      values={trek}
      photos={trek.photos}
      trekId={trek.id}
      topicPhotos={topicPhotos}
      regions={regions}
      similarOptions={similarOptions}
      guideOptions={guides.map((guide) => toGuideOption(guide, today))}
      regionId={trek.regionId}
      isNew={false}
      pdfMapUrl={trek.pdfMapPath ? trekFileUrl(trek.pdfMapPath) : null}
      lastSaved={`Saved ${formatDateTime(trek.updatedAt)} Nepal time`}
      isJustAdded={added === "1"}
      isJustCopied={copied === "1"}
      headerActions={
        canDelete && (
          <ConfirmRemoveButton
            verb="delete"
            name={trek.name}
            consequence="Its page leaves the website, with its days, prices and questions. Other treks' similar lists drop it, and its reviews stay without a trek. Library photos stay."
            action={deleteTrek.bind(null, trek.siteId, trek.id)}
            blockers={toTrekBlockers(usage)}
          />
        )
      }
    />
  );
};

export default TrekPage;
