"use client";

import Image from "next/image";
import { useActionState } from "react";

import { signIn } from "../actions/signIn";
import type { SignInState } from "../actions/signIn";
import { AuthHeading } from "./AuthHeading";
import { CredentialsForm } from "./CredentialsForm";

type LoginFormProps = {
  /** Where to go after signing in (already checked on the server). */
  redirectTo: string;
  /** Email kept by "Keep me signed in" on this computer (checked on the server), or "". */
  rememberedEmail: string;
};

/** Sign-in content. The form posts to the signIn Server Action, so it also works before JavaScript loads. */
export const LoginForm = ({ redirectTo, rememberedEmail }: LoginFormProps) => {
  // A kept email starts filled in, with "Keep me signed in" still ticked.
  const initialState: SignInState = { error: null, email: rememberedEmail, remember: Boolean(rememberedEmail) };
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <>
      <div className="flex flex-col gap-3.5">
        <Image src="/brand/logo.svg" alt="Travel To Nepal" width={75} height={44} className="h-11 w-auto self-start" preload />
        <AuthHeading title="Sign in" description="For the Travel To Nepal team only." />
      </div>
      <CredentialsForm
        action={formAction}
        state={state}
        redirectTo={redirectTo}
        isPending={isPending}
        rememberedEmail={rememberedEmail}
      />
    </>
  );
};
