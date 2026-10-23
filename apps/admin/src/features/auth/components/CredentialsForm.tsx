import type { FormEvent } from "react";

import { REMEMBER_DAYS } from "../constants";
import { FormAlert } from "./FormAlert";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";
import { TextField } from "./TextField";

type CredentialsFormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** Shown above the fields once sign-in is connected. */
  error?: { message: string; detail?: string };
};

export const CredentialsForm = ({ onSubmit, error }: CredentialsFormProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4">
    {error && <FormAlert message={error.message} detail={error.detail} />}
    <TextField
      name="email"
      type="email"
      label="Email"
      icon="mail"
      placeholder="you@traveltonepal.com"
      autoComplete="username"
      isInvalid={Boolean(error)}
      maxLength={254}
      required
      autoFocus
    />
    <PasswordField isInvalid={Boolean(error)} />
    <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-text">
      <input
        type="checkbox"
        name="remember"
        className="m-0 size-4.5 flex-none cursor-pointer accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      Keep me signed
    </label>
    <SubmitButton isLoading={false} loadingLabel="Checking…">
      Sign in
    </SubmitButton>

    <p className="m-0 text-caption font-normal text-muted-foreground">
      Can&apos;t sign in? The developer can reset the admin password.
    </p>
  </form>
);
