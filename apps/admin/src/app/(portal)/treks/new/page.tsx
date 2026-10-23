import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveTrek } from "@/features/treks/actions/saveTrek";
import { TrekEditor } from "@/features/treks/components/editor/TrekEditor";
import { EMPTY_TREK_VALUES, NO_TREK_PHOTOS } from "@/features/treks/constants";
import { listRegionOptions, listSimilarTrekOptions } from "@/features/treks/services/treksRepository";
import { todayInNepal } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: "New trek" };

/** Add a trek: the trek editor, empty (status Draft). Saving creates it and opens it. */
const NewTrekPage = async () => {
  await requireAdmin();
  const [regions, similarOptions] = await Promise.all([listRegionOptions(), listSimilarTrekOptions(null)]);

  return (
    <TrekEditor
      action={saveTrek.bind(null, null)}
      values={EMPTY_TREK_VALUES}
      photos={NO_TREK_PHOTOS}
      regions={regions}
      similarOptions={similarOptions}
      regionId={null}
      isNew
      today={todayInNepal()}
    />
  );
};

export default NewTrekPage;
