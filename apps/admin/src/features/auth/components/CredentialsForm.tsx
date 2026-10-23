import { FormAlert } from "@/components/ui/FormAlert";

import type { SignInState } from "../actions/signIn";
import { forgetRememberedEmail } from "../actions/forgetRememberedEmail";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";
import { TextField } from "./TextField";

type CredentialsFormProps = {
  action: (formData: FormData) => void;
  state: SignInState;
  /** Checked again on the server (getSafeRedirectPath); posted back with the form. */
  redirectTo: string;
  isPending: boolean;
  /** The email kept by "Keep me signed in" on this computer, or "". */
  rememberedEmail: string;
};

export const CredentialsForm = ({ action, state, redirectTo, isPending, rememberedEmail }: CredentialsFormProps) => {
  const { error } = state;
  // With the email already filled in, the cursor starts in the password field.
  const isEmailFilled = Boolean(state.email);

  return (
    <form action={action} className="flex flex-col gap-4">
      {error && <FormAlert message={error.message} detail={error.detail} />}
      <input type="hidden" name="next" value={redirectTo} />
      <TextField
        name="email"
        type="email"
        label="Email"
        icon="mail"
        placeholder="you@traveltonepal.com"
        autoComplete="username"
        defaultValue={state.email}
        isInvalid={Boolean(error)}
        maxLength={254}
        required
        autoFocus={!isEmailFilled}
      />
      {rememberedEmail && (
        // Same form, other action: forgets the kept email. formNoValidate: no need to fill in the password.
        <button
          type="submit"
          formAction={forgetRememberedEmail}
          formNoValidate
          disabled={isPending}
          className="m-0 -mt-2 cursor-pointer self-start rounded-sm border-0 bg-transparent p-0 font-sans text-caption font-semibold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-60"
        >
          Not you? Use another email
        </button>
      )}
      <PasswordField isInvalid={Boolean(error)} autoFocus={isEmailFilled} />
      <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-text">
        <input
          type="checkbox"
          name="remember"
          defaultChecked={state.remember}
          className="m-0 size-4.5 flex-none cursor-pointer accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        Keep me signed
      </label>
      <SubmitButton isLoading={isPending} loadingLabel="Checking…">
        Sign in
      </SubmitButton>

      <p className="m-0 text-caption font-normal text-muted-foreground">
        Can&apos;t sign in? The developer can reset the admin password.
      </p>
    </form>
  );
};
