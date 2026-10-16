import { useState } from "react";

import { loginRequest } from "../services/loginRequest";
import type { Credentials } from "../types";

export type LoginStep =
  | { name: "credentials" }
  | { name: "code"; credentials: Credentials }
  | { name: "setup"; credentials: Credentials; secret: string; qrDataUrl: string };

type UseLoginFlowArgs = {
  loginUrl: string;
  redirectTo: string;
};

/** Steps: email + password → 6-digit code (or authenticator setup on the first login) → admin. */
export const useLoginFlow = ({ loginUrl, redirectTo }: UseLoginFlowArgs) => {
  const [step, setStep] = useState<LoginStep>({ name: "credentials" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const send = async (credentials: Credentials, extra: { totp?: string; totpSetupSecret?: string } = {}) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    const result = await loginRequest(loginUrl, { ...credentials, ...extra });

    if (result.status === "success") {
      // Full page load so Payload's admin starts with the new session. Stay "submitting" meanwhile.
      window.location.assign(redirectTo);
      return;
    }

    setIsSubmitting(false);
    if (result.status === "totpRequired") return setStep({ name: "code", credentials });
    if (result.status === "totpSetupRequired") return setStep({ name: "setup", credentials, ...result });
    setError(result.message);
  };

  const submitCredentials = (credentials: Credentials) => send(credentials);

  const submitCode = (code: string) => {
    if (step.name === "credentials") return;
    const totpSetupSecret = step.name === "setup" ? step.secret : undefined;
    return send(step.credentials, { totp: code, totpSetupSecret });
  };

  const startOver = () => {
    setStep({ name: "credentials" });
    setError(null);
  };

  return { step, error, isSubmitting, submitCredentials, submitCode, startOver };
};
