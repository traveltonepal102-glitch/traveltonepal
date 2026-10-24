import { FormGroup } from "@/components/editor/FormGroup";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { TagListField } from "@/components/ui/TagListField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { AUTHOR_LANGUAGES, AUTHOR_LIMITS as LIMIT, MAX_TOPICS, TOPIC_SUGGESTIONS } from "../../constants";
import type { AuthorValues } from "../../types";

type AuthorArticleFieldsProps = {
  values: AuthorValues;
  errors: FieldErrors;
  onEdit: () => void;
};

/** "On the article": the job title in the byline, the languages they write in and their topics. */
export const AuthorArticleFields = ({ values, errors, onEdit }: AuthorArticleFieldsProps) => (
  <FormGroup title="On the article" where="Byline at the top">
    <TextField
      name="jobTitle"
      label="Job title"
      hint="Shown under the name. Say why they know the topic."
      defaultValue={values.jobTitle}
      placeholder="e.g. Senior trek leader, Langtang"
      maxLength={LIMIT.jobTitle}
      error={errors.jobTitle}
    />
    <div className="flex flex-col gap-1">
      <ChoiceChips legend="Writes in" name="writesIn" type="checkbox" options={AUTHOR_LANGUAGES} defaultValues={values.writesIn} error={errors.writesIn} />
      <span className="text-xs text-muted-foreground">Only these authors can be picked on English or German travel guides.</span>
    </div>
    <TagListField
      label="Writes about"
      name="topic"
      initial={values.topics}
      suggestions={TOPIC_SUGGESTIONS}
      maxItems={MAX_TOPICS}
      maxLength={LIMIT.topic}
      placeholder="Type a topic, e.g. Langtang"
      hint="Suggests this author first in the travel guide editor. Not shown on the site."
      error={errors.topics}
      onEdit={onEdit}
    />
  </FormGroup>
);
