import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { listPublishedArticleChoices } from "@/features/travel-guides/services/articleOptions";
import { toGuideOption } from "@/features/trekking-guides/lib/guideOptions";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { saveTrek } from "@/features/treks/actions/saveTrek";
import { TrekEditor } from "@/features/treks/components/editor/TrekEditor";
import { EMPTY_TREK_VALUES, NO_TREK_PHOTOS } from "@/features/treks/constants";
import { listRegionOptions, listSimilarTrekOptions } from "@/features/treks/services/treksRepository";
import { todayInNepal } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: "New trek" };

/** Add a trek to the website "Working on" shows: the trek editor, empty (status Draft). Saving creates it and opens it. */
const NewTrekPage = async () => {
  await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  const [regions, similarOptions, guides, blogOptions] = await Promise.all([
    listRegionOptions(),
    listSimilarTrekOptions(site.id, null),
    listTrekkingGuides(site.id),
    // Only a region website's trek pages show "Read before you go".
    site.kind === "region" ? listPublishedArticleChoices(site.id) : null,
  ]);
  const today = todayInNepal();

  return (
    <TrekEditor
      action={saveTrek.bind(null, site.id, null)}
      values={EMPTY_TREK_VALUES}
      photos={NO_TREK_PHOTOS}
      trekId={null}
      topicPhotos={[]}
      regions={regions}
      similarOptions={similarOptions}
      blogOptions={blogOptions}
      guideOptions={guides.map((guide) => toGuideOption(guide, today))}
      regionId={null}
      isNew
      trekFileUrls={{ pdfMap: null, gpxTrack: null }}
    />
  );
};

export default NewTrekPage;
