"use client";

import type { EditorSaveAction } from "@/components/editor/types";
import { LibraryPhotoField } from "@/features/photos/components/LibraryPhotoField";
import type { Photo } from "@/features/photos/types";

import { ABOUT_PHOTO_SLOTS } from "../../constants";
import { aboutReadiness } from "../../lib/pageReadiness";
import { ABOUT_SECTIONS, aboutSectionErrors } from "../../sections";
import type { AboutFacts, AboutPageValues, AboutTeamPerson } from "../../types";
import { PageEditorForm } from "../PageEditorForm";
import { PageGoogleCard } from "../PageGoogleCard";
import { PageTopCard } from "../PageTopCard";
import { AboutFlexibleCard } from "./AboutFlexibleCard";
import { AboutHonestCard } from "./AboutHonestCard";
import { AboutLicencesCard } from "./AboutLicencesCard";
import { AboutListenCard } from "./AboutListenCard";
import { AboutNumbersCard } from "./AboutNumbersCard";
import { AboutOpenMindCard } from "./AboutOpenMindCard";
import { AboutPromisesCard } from "./AboutPromisesCard";
import { AboutSafetyCard } from "./AboutSafetyCard";
import { AboutStoryCard } from "./AboutStoryCard";
import { AboutTeamCard } from "./AboutTeamCard";

type AboutPageEditorProps = {
  action: EditorSaveAction;
  values: AboutPageValues;
  photo: Photo | null;
  /** The page's photos by place (ABOUT_PHOTO_SLOTS). */
  photoSlots: (Photo | null)[];
  libraryPhotos: Photo[];
  officeAuthors: { id: string; name: string; jobTitle: string }[];
  team: AboutTeamPerson[];
  facts: AboutFacts;
  websiteUrl: string | null;
  lastSaved: string;
};

const FIXED_NOTE =
  "Fixed in the website, not edited here: “Responsible travel”, “Our office in Kathmandu” and the “Ready to plan your trek with us?” box at the end (WhatsApp and email). Address, hours, map and licence numbers come from Site settings.";

/** Pages › About (design: About.dc.html): the About page's sections, top to bottom, then the trek pages' promises. */
export const AboutPageEditor = ({ action, values, photo, photoSlots, libraryPhotos, officeAuthors, team, facts, websiteUrl, lastSaved }: AboutPageEditorProps) => {
  const slot = (index: number) => photoSlots[index] ?? null;
  return (
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
            <AboutNumbersCard values={values} facts={facts} errors={errors} />
          </div>
          <div hidden={activeKey !== "listen"}>
            <AboutListenCard values={values.listen} errors={errors} />
          </div>
          <div hidden={activeKey !== "honest"}>
            <AboutHonestCard values={values.honest} errors={errors} />
          </div>
          <div hidden={activeKey !== "flexible"}>
            <AboutFlexibleCard values={values.flexible} photo={slot(ABOUT_PHOTO_SLOTS.flexible)} libraryPhotos={libraryPhotos} errors={errors} onEdit={onEdit} />
          </div>
          <div hidden={activeKey !== "openMind"}>
            <AboutOpenMindCard values={values.openMind} photos={ABOUT_PHOTO_SLOTS.places.map(slot)} libraryPhotos={libraryPhotos} errors={errors} onEdit={onEdit} />
          </div>
          <div hidden={activeKey !== "safety"}>
            <AboutSafetyCard values={values.safety} errors={errors} />
          </div>
          <div hidden={activeKey !== "story"}>
            <AboutStoryCard values={values} officeAuthors={officeAuthors} founderPhoto={slot(ABOUT_PHOTO_SLOTS.founder)} libraryPhotos={libraryPhotos} errors={errors} onEdit={onEdit} />
          </div>
          <div hidden={activeKey !== "team"}>
            <AboutTeamCard values={values} people={team} errors={errors} />
          </div>
          <div hidden={activeKey !== "licences"}>
            <AboutLicencesCard values={values} facts={facts} errors={errors} />
          </div>
          <div hidden={activeKey !== "promises"}>
            <AboutPromisesCard values={values} errors={errors} />
          </div>
          <div hidden={activeKey !== "seo"}>
            <PageGoogleCard values={values} errors={errors} websitePath="/about" />
          </div>
        </>
      )}
    </PageEditorForm>
  );
};
