import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { toGuideOption } from "@/features/trekking-guides/lib/guideOptions";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { saveTrek } from "@/features/treks/actions/saveTrek";
import { TrekEditor } from "@/features/treks/components/editor/TrekEditor";
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

/** Edit a trek (design: Admin-trek-editor.dc.html). "?added=1" right after it was added. */
const TrekPage = async ({ params, searchParams }: TrekPageProps) => {
  await requireAdmin();
  const { trekId } = await params;
  const [trek, regions, similarOptions, guides] = await Promise.all([
    loadTrek(params),
    listRegionOptions(),
    listSimilarTrekOptions(trekId),
    listTrekkingGuides(),
  ]);
  const today = todayInNepal();
  const { added } = await searchParams;

  return (
    <TrekEditor
      action={saveTrek.bind(null, trek.id)}
      values={trek}
      photos={trek.photos}
      regions={regions}
      similarOptions={similarOptions}
      guideOptions={guides.map((guide) => toGuideOption(guide, today))}
      regionId={trek.regionId}
      isNew={false}
      pdfMapUrl={trek.pdfMapPath ? trekFileUrl(trek.pdfMapPath) : null}
      lastSaved={`Saved ${formatDateTime(trek.updatedAt)} Nepal time`}
      isJustAdded={added === "1"}
    />
  );
};

export default TrekPage;
