import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { toGuideOption } from "@/features/trekking-guides/lib/guideOptions";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { saveTrek } from "@/features/treks/actions/saveTrek";
import { TrekEditor } from "@/features/treks/components/editor/TrekEditor";
import { EMPTY_TREK_VALUES, NO_TREK_PHOTOS } from "@/features/treks/constants";
import { listRegionOptions, listSimilarTrekOptions } from "@/features/treks/services/treksRepository";
import { todayInNepal } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: "New trek" };

/** Add a trek: the trek editor, empty (status Draft). Saving creates it and opens it. */
const NewTrekPage = async () => {
  await requireAdmin();
  const [regions, similarOptions, guides] = await Promise.all([listRegionOptions(), listSimilarTrekOptions(null), listTrekkingGuides()]);
  const today = todayInNepal();

  return (
    <TrekEditor
      action={saveTrek.bind(null, null)}
      values={EMPTY_TREK_VALUES}
      photos={NO_TREK_PHOTOS}
      regions={regions}
      similarOptions={similarOptions}
      guideOptions={guides.map((guide) => toGuideOption(guide, today))}
      regionId={null}
      isNew
      pdfMapUrl={null}
    />
  );
};

export default NewTrekPage;
