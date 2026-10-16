import type { FormEvent } from "react";

import { FormAlert } from "./FormAlert";
import { SubmitButton } from "./SubmitButton";
import { TextField } from "./TextField";

type CodeFormProps = {
  error: string | null;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
};

export const CodeForm = ({ error, isSubmitting, submitLabel, onSubmit, onBack }: CodeFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(String(new FormData(event.currentTarget).get("code") ?? ""));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <FormAlert message={error} />}
      <TextField
        name="code"
        label="6-digit code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        title="Enter the 6 digits from your authenticator app"
        className="tracking-[0.3em] tabular-nums"
        required
        autoFocus
      />
      <SubmitButton isLoading={isSubmitting} loadingLabel="Signing in…">
        {submitLabel}
      </SubmitButton>
      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className="m-0 cursor-pointer self-center rounded-sm border-0 bg-transparent p-1 font-sans text-body-sm font-semibold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-60"
      >
        Use a different account
      </button>
    </form>
  );
};
