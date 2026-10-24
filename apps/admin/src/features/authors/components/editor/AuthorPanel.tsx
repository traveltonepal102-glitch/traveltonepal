"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@ttn/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import { FormGroup } from "@/components/editor/FormGroup";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { PhotoAndNameFields } from "@/components/shared/PhotoAndNameFields";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { TextField } from "@/components/ui/TextField";

import { removeAuthor } from "../../actions/removeAuthor";
import { AUTHOR_LIMITS as LIMIT, AUTHORS_PATH } from "../../constants";
import { useAuthorDraft } from "../../hooks/useAuthorDraft";
import { authorPerson } from "../../lib/authorRules";
import type { Author, AuthorGuide, AuthorValues } from "../../types";
import { AuthorArticleFields } from "./AuthorArticleFields";
import { AuthorKindField } from "./AuthorKindField";
import { AuthorPreview } from "./AuthorPreview";
import { AuthorVisibilityFields } from "./AuthorVisibilityFields";
import { ProfileLinksField } from "./ProfileLinksField";

type AuthorPanelProps = {
  /** saveAuthor bound to this author's id (null for a new author). */
  action: EditorSaveAction;
  /** The saved author; null for a new one. */
  author: Author | null;
  values: AuthorValues;
  guides: AuthorGuide[];
  /** Guides that are already another author. */
  takenGuideIds: string[];
  canRemove: boolean;
  isJustAdded: boolean;
};

const STATUS_TONE = { saved: "text-whatsapp", unsaved: "text-saffron-ink", neutral: "text-muted-foreground" } as const;

/**
 * Add or edit one author in a drawer over the list (design: Admin-people, tab "Authors"). One Save sends
 * everything. For a trekking guide, the photo, name, bio and links come from Trekking guides: those fields are
 * hidden and not sent.
 */
export const AuthorPanel = ({ action, author, values, guides, takenGuideIds, canRemove, isJustAdded }: AuthorPanelProps) => {
  const form = useEditorForm<"author">({
    action,
    firstKey: "author",
    firstSectionWithError: () => undefined,
    isNew: !author,
    addedLabel: isJustAdded ? "Author added" : undefined,
  });
  const router = useRouter();
  const { errors, markDirty } = form;
  const [status, tone] = form.saveStatus;
  const [kind, setKind] = useState(values.kind);
  const { draft, readForm, setPhoto } = useAuthorDraft({ ...values, photo: author?.photo ?? null });
  const person = authorPerson({ ...draft, kind }, guides);
  const isGuide = kind === "guide";
  const title = author ? authorPerson(author, guides).name : "Add author";

  const close = () => {
    if (form.isDirty && !window.confirm("Close without saving? Your changes to this author will be lost.")) return;
    router.push(AUTHORS_PATH, { scroll: false });
  };

  return (
    <SideDrawer
      kicker={author ? "Edit author" : "New author"}
      title={title}
      status={
        <p role="status" className={cn("m-0 text-xs font-semibold", STATUS_TONE[tone])}>
          {status}
        </p>
      }
      onClose={close}
    >
      <form
        noValidate
        onSubmit={form.handleSubmit}
        onChange={(event) => {
          markDirty();
          readForm(event);
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 max-tablet:px-5">
          {form.state.status === "error" && <FormAlert message={form.state.message} />}
          <AuthorPreview kind={kind} person={person} jobTitle={draft.jobTitle} showAuthorBox={draft.showAuthorBox} />
          <AuthorKindField kind={kind} onKindChange={setKind} guideId={values.guideId} guides={guides} takenGuideIds={takenGuideIds} errors={errors} />
          {/* Kept while hidden, so switching back keeps what was typed; disabled, so a guide author doesn't send it. */}
          <fieldset disabled={isGuide} hidden={isGuide} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
            <PhotoAndNameFields
              photo={author?.photo ?? null}
              name={values.name}
              photoConsent={values.photoConsent}
              typedName={draft.name}
              nameMaxLength={LIMIT.name}
              photoHint="A real photo of the person. Square, face clearly visible."
              nameHint="Only the name. No “by” or company name."
              errors={errors}
              onEdit={markDirty}
              onPhotoChange={setPhoto}
            />
          </fieldset>
          <AuthorArticleFields values={values} errors={errors} onEdit={markDirty} />
          <fieldset disabled={isGuide} hidden={isGuide} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
            <FormGroup title="Short bio" where="Author box">
              <TextField
                name="bio"
                label="Short bio in English"
                hint="Years of experience, regions known best, languages spoken. German comes with the German website."
                multiline
                rows={3}
                defaultValue={values.bio}
                maxLength={LIMIT.bio}
                showCount
                error={errors.bio}
              />
            </FormGroup>
            <ProfileLinksField links={values.profileLinks} errors={errors} onEdit={markDirty} />
          </fieldset>
          <AuthorVisibilityFields values={values} kind={kind} />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
          {author && canRemove && <ConfirmRemoveButton name={title} action={removeAuthor.bind(null, author.id)} />}
          <span className="flex-1" />
          <Dialog.Close type="button" className={secondaryButton}>
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={form.isSaving} className={primaryButton}>
            {form.isSaving ? "Saving…" : author ? "Save changes" : "Add author"}
          </button>
        </div>
      </form>
    </SideDrawer>
  );
};
