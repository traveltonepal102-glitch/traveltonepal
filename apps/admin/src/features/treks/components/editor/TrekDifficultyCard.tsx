"use client";

import { useState } from "react";

import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { DIFFICULTIES, difficultyOf } from "../../constants";
import type { TrekDifficulty, TrekValues } from "../../types";

type TrekDifficultyCardProps = {
  values: TrekValues;
  errors: FieldErrors;
};

const gradeLabel = (grades: number[]) => `grade ${grades.join("–")}`;

/** Difficulty, and its grade 1–5 (only Easy has a choice: 1 or 2). */
export const TrekDifficultyCard = ({ values, errors }: TrekDifficultyCardProps) => {
  const [difficulty, setDifficulty] = useState<TrekDifficulty>(values.difficulty);
  const { grades } = difficultyOf(difficulty);
  const keepsGrade = grades.includes(values.grade);

  return (
    <FormSection title="Difficulty" hint="Shown as a badge on the trek card and in the trip facts.">
      <ChoiceChips
        legend="Difficulty"
        name="difficulty"
        type="radio"
        options={DIFFICULTIES.map((level) => ({ value: level.value, label: level.label, sublabel: gradeLabel(level.grades) }))}
        defaultValues={[values.difficulty]}
        onChange={([next]) => {
          const match = DIFFICULTIES.find((level) => level.value === next);
          if (match) setDifficulty(match.value);
        }}
        error={errors.difficulty}
      />
      {grades.length > 1 ? (
        <SelectField
          key={difficulty}
          name="grade"
          label="Grade"
          options={grades.map((grade) => ({ value: String(grade), label: `Grade ${grade} of 5` }))}
          defaultValue={String(keepsGrade ? values.grade : grades[grades.length - 1])}
          error={errors.grade}
          className="max-w-60"
        />
      ) : (
        <input type="hidden" name="grade" value={grades[0]} />
      )}
    </FormSection>
  );
};
