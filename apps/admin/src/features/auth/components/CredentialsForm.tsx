import type { FormEvent } from "react";

import type { Credentials } from "../types";
import { FormAlert } from "./FormAlert";
import { SubmitButton } from "./SubmitButton";
import { TextField } from "./TextField";

type CredentialsFormProps = {
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (credentials: Credentials) => void;
};

export const CredentialsForm = ({ error, isSubmitting, onSubmit }: CredentialsFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({ email: String(data.get("email") ?? ""), password: String(data.get("password") ?? "") });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <FormAlert message={error} />}
      <TextField name="email" type="email" label="Email" autoComplete="username" required autoFocus />
      <TextField name="password" type="password" label="Password" autoComplete="current-password" required />
      <SubmitButton isLoading={isSubmitting} loadingLabel="Checking…">
        Continue
      </SubmitButton>
    </form>
  );
};
