"use client";

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import { useState } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { NEW_AUTHOR_PATH } from "@/features/authors/constants";
import { NEW_GUIDE_PATH } from "@/features/trekking-guides/constants";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { ArticleOptions, ArticleValues } from "../../../types";

type PeopleCardProps = {
  values: ArticleValues;
  authors: ArticleOptions["authors"];
  checkers: ArticleOptions["checkers"];
  errors: FieldErrors;
};

const AddLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className="inline-flex items-center gap-1 self-start text-caption font-bold text-brand">
    <Icon name="add" size={16} />
    {label}
  </Link>
);

/** "People": who wrote it (from Authors, English writers only) and the trekking guide who checked it. */
export const PeopleCard = ({ values, authors, checkers, errors }: PeopleCardProps) => {
  const [authorId, setAuthorId] = useState(values.authorId ?? "");
  const [checkerId, setCheckerId] = useState(values.checkerGuideId ?? "");
  const author = authors.find((item) => item.id === authorId);

  return (
    <FormSection title="People">
      <SelectField
        name="authorId"
        label="Written by"
        hint="Shown at the top with photo and bio. Only authors who write in English are offered."
        options={[
          { value: "", label: "Pick an author" },
          ...authors.filter((item) => item.writesEnglish || item.id === values.authorId).map((item) => ({ value: item.id, label: `${item.name}${item.isVerified ? " ✓" : ""} · ${item.jobTitle}` })),
        ]}
        defaultValue={authorId}
        onValueChange={setAuthorId}
        error={errors.authorId}
      />
      <AddLink href={NEW_AUTHOR_PATH} label="Add a new author" />
      <SelectField
        name="checkerGuideId"
        label="Checked by a local guide"
        hint="Shown as “Checked by” at the top and in the author box. Only guides who can check travel guides are offered."
        options={[{ value: "", label: "Not checked yet" }, ...checkers.map((item) => ({ value: item.id, label: `${item.name} · ${item.role}` }))]}
        defaultValue={checkerId}
        onValueChange={setCheckerId}
        error={errors.checkerGuideId}
      />
      {author?.isGuest && !checkerId && (
        <p className="m-0 flex items-start gap-2 rounded-md bg-saffron-tint px-3 py-2 text-caption text-saffron-ink">
          <Icon name="warning" size={18} className="flex-none" />
          {author.name} is a guest writer: a trekking guide must check this guide before it can be published.
        </p>
      )}
      <AddLink href={NEW_GUIDE_PATH} label="Add a new guide" />
    </FormSection>
  );
};
