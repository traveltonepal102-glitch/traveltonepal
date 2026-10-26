"use client";

import type { EditorSaveAction } from "@/components/editor/types";
import { LibraryPhotoField } from "@/features/photos/components/LibraryPhotoField";
import type { Photo } from "@/features/photos/types";

import { aboutReadiness } from "../../lib/pageReadiness";
import { ABOUT_SECTIONS, aboutSectionErrors } from "../../sections";
import type { AboutFacts, AboutPageValues, AboutTeamPerson } from "../../types";
import { PageEditorForm } from "../PageEditorForm";
import { PageGoogleCard } from "../PageGoogleCard";
import { PageTopCard } from "../PageTopCard";
import { AboutLicencesCard } from "./AboutLicencesCard";
import { AboutNumbersCard } from "./AboutNumbersCard";
import { AboutPromisesCard } from "./AboutPromisesCard";
import { AboutReviewsCard } from "./AboutReviewsCard";
import { AboutStoryCard } from "./AboutStoryCard";
import { AboutTeamCard } from "./AboutTeamCard";
import { MilestoneListEditor } from "./MilestoneListEditor";

type AboutPageEditorProps = {
  action: EditorSaveAction;
  values: AboutPageValues;
  photo: Photo | null;
  storyPhotos: Photo[];
  libraryPhotos: Photo[];
  officeAuthors: { id: string; name: string; jobTitle: string }[];
  team: AboutTeamPerson[];
  facts: AboutFacts;
  websiteUrl: string | null;
  lastSaved: string;
};

const FIXED_NOTE =
  "Fixed in the website, not edited here: “Responsible travel”, “Our office in Kathmandu” and the “Ready to plan your trek with us?” box at the end (it opens WhatsApp). Address, hours and map come from Site settings.";

/** Pages › About (design: Admin-pages, "About us"): the About page's sections, top to bottom. */
export const AboutPageEditor = ({ action, values, photo, storyPhotos, libraryPhotos, officeAuthors, team, facts, websiteUrl, lastSaved }: AboutPageEditorProps) => (
  <PageEditorForm
    action={action}
    title="About us"
    lastSaved={lastSaved}
    websiteUrl={websiteUrl}
    pathFor={() => "/about"}
    sections={ABOUT_SECTIONS}
    readiness={aboutReadiness(values, team, facts)}
    errorLookup={aboutSectionErrors}
    fixedNote={FIXED_NOTE}
  >
    {({ activeKey, errors, onEdit }) => (
      <>
        <div hidden={activeKey !== "top"} className="flex flex-col gap-4">
          <PageTopCard values={values} errors={errors} eyebrow={{ label: "Small label above the heading", placeholder: "About Travel To Nepal" }}>
            <LibraryPhotoField name="photoId" label="Photo behind the heading" hint="A wide landscape photo works best." initial={photo} photos={libraryPhotos} onEdit={onEdit} />
          </PageTopCard>
          <AboutNumbersCard trekkersGuided={values.trekkersGuided} facts={facts} errors={errors} />
        </div>
        <div hidden={activeKey !== "story"} className="flex flex-col gap-4">
          <AboutStoryCard values={values} officeAuthors={officeAuthors} storyPhotos={storyPhotos} libraryPhotos={libraryPhotos} errors={errors} onEdit={onEdit} />
          <MilestoneListEditor milestones={values.milestones} errors={errors} onEdit={onEdit} />
        </div>
        <div hidden={activeKey !== "promises"}>
          <AboutPromisesCard values={values} errors={errors} />
        </div>
        <div hidden={activeKey !== "team"}>
          <AboutTeamCard values={values} people={team} errors={errors} />
        </div>
        <div hidden={activeKey !== "reviews"} className="flex flex-col gap-4">
          <AboutReviewsCard heading={values.reviewsHeading} errors={errors} />
        </div>
        <div hidden={activeKey !== "licences"}>
          <AboutLicencesCard values={values} facts={facts} errors={errors} />
        </div>
        <div hidden={activeKey !== "seo"}>
          <PageGoogleCard values={values} errors={errors} websitePath="/about" />
        </div>
      </>
    )}
  </PageEditorForm>
);
