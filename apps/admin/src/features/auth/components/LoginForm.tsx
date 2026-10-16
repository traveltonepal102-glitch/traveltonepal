"use client";

import { useLoginFlow } from "../hooks/useLoginFlow";
import { AuthHeading } from "./AuthHeading";
import { CodeForm } from "./CodeForm";
import { CredentialsForm } from "./CredentialsForm";
import { TotpSetupInstructions } from "./TotpSetupInstructions";

type LoginFormProps = {
  loginUrl: string;
  redirectTo: string;
};

export const LoginForm = ({ loginUrl, redirectTo }: LoginFormProps) => {
  const { step, error, isSubmitting, submitCredentials, submitCode, startOver } = useLoginFlow({
    loginUrl,
    redirectTo,
  });

  if (step.name === "credentials") {
    return (
      <>
        <AuthHeading title="Sign in" description="Admin for the Travel To Nepal websites." />
        <CredentialsForm error={error} isSubmitting={isSubmitting} onSubmit={submitCredentials} />
      </>
    );
  }

  const isSetup = step.name === "setup";

  return (
    <>
      <AuthHeading
        title={isSetup ? "Set up two-step sign-in" : "Enter your code"}
        description={
          isSetup
            ? "Your account needs an authenticator app. You only do this once."
            : `Open your authenticator app and enter the code for ${step.credentials.email}.`
        }
      />
      {isSetup && <TotpSetupInstructions secret={step.secret} qrDataUrl={step.qrDataUrl} />}
      <CodeForm
        error={error}
        isSubmitting={isSubmitting}
        submitLabel={isSetup ? "Turn on and sign in" : "Sign in"}
        onSubmit={submitCode}
        onBack={startOver}
      />
    </>
  );
};
