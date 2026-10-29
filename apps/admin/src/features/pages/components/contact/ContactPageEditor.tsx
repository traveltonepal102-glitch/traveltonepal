"use client";

import { FaqListEditor } from "@/components/editor/FaqListEditor";
import type { EditorSaveAction } from "@/components/editor/types";
import { TextField } from "@/components/ui/TextField";
import { LibraryPhotoField } from "@/features/photos/components/LibraryPhotoField";
import type { Photo } from "@/features/photos/types";

import { MAX_CONTACT_FAQS, PAGE_LIMITS as LIMIT, RECOMMENDED_CONTACT_FAQS } from "../../constants";
import { contactReadiness } from "../../lib/pageReadiness";
import { CONTACT_SECTIONS, contactSectionErrors } from "../../sections";
import type { ContactPageValues } from "../../types";
import { PageEditorForm } from "../PageEditorForm";
import { PageGoogleCard } from "../PageGoogleCard";
import { PageTopCard } from "../PageTopCard";
import { ContactOfficeCard } from "./ContactOfficeCard";
import { ContactStepsCard } from "./ContactStepsCard";
import { ContactWaysCard } from "./ContactWaysCard";

type ContactPageEditorProps = {
  action: EditorSaveAction;
  values: ContactPageValues;
  photo: Photo | null;
  sharePhoto: Photo | null;
  libraryPhotos: Photo[];
  websiteUrl: string | null;
  lastSaved: string;
};

const FIXED_NOTE =
  "Fixed in the website, not edited here: the WhatsApp, email and phone boxes, the message helper, and the office address, hours and map. They come from Site settings, so they are the same on every page.";

/** Pages › Contact (design: Admin-pages, "Contact"): the Contact page's sections, top to bottom. */
export const ContactPageEditor = ({ action, values, photo, sharePhoto, libraryPhotos, websiteUrl, lastSaved }: ContactPageEditorProps) => (
  <PageEditorForm
    action={action}
    title="Contact"
    lastSaved={lastSaved}
    websiteUrl={websiteUrl}
    pathFor={() => "/contact"}
    sections={CONTACT_SECTIONS}
    readiness={contactReadiness(values)}
    errorLookup={contactSectionErrors}
    fixedNote={FIXED_NOTE}
  >
    {({ activeKey, errors, onEdit }) => (
      <>
        <div hidden={activeKey !== "top"}>
          <PageTopCard
            values={values}
            errors={errors}
            eyebrow={{ label: "Green line above the heading", placeholder: "Our team is online · Kathmandu", hint: "Shown while the office is open. Outside office hours it says “Office closed now · we reply first thing in the morning” by itself." }}
          >
            <LibraryPhotoField name="photoId" label="Photo behind the heading" hint="A wide landscape photo works best." initial={photo} photos={libraryPhotos} onEdit={onEdit} />
          </PageTopCard>
        </div>
        <div hidden={activeKey !== "ways"}>
          <ContactWaysCard values={values} errors={errors} />
        </div>
        <div hidden={activeKey !== "steps"}>
          <ContactStepsCard steps={values.nextSteps} errors={errors} />
        </div>
        <div hidden={activeKey !== "office"} className="flex flex-col gap-4">
          <ContactOfficeCard values={values} errors={errors} onEdit={onEdit} />
        </div>
        <div hidden={activeKey !== "faq"}>
          <FaqListEditor
            faqs={values.faqs}
            hint="Added as FAQ data for Google."
            recommendedCount={RECOMMENDED_CONTACT_FAQS}
            maxItems={MAX_CONTACT_FAQS}
            limits={{ question: LIMIT.faqQuestion, answer: LIMIT.faqAnswer }}
            errors={errors}
            onEdit={onEdit}
          >
            <TextField name="faqHeading" label="Section heading" labelNote="(H2)" defaultValue={values.faqHeading} placeholder="Before you get in touch" maxLength={LIMIT.sectionHeading} showCount inputClassName="font-display font-bold" error={errors.faqHeading} />
          </FaqListEditor>
        </div>
        <div hidden={activeKey !== "seo"}>
          <PageGoogleCard values={values} errors={errors} websitePath="/contact" sharePhoto={sharePhoto} shareFallback="the photo behind the heading, else the share image in Site settings" onEdit={onEdit} />
        </div>
      </>
    )}
  </PageEditorForm>
);
