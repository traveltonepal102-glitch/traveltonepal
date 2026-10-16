import type { PayloadRequest } from "payload";

/** Result of the code check in `checkTotpCode`, read by `completeTotpLogin` after the password check. */
export type TotpLoginContext =
  | { status: "required" }
  | { status: "setup" }
  | { status: "verified"; timeStep: number; newSecret?: string };

const CONTEXT_KEY = "totpLogin";

export const setTotpLoginContext = (req: PayloadRequest, value: TotpLoginContext) => {
  req.context[CONTEXT_KEY] = value;
};

export const getTotpLoginContext = (req: PayloadRequest): TotpLoginContext | undefined =>
  req.context[CONTEXT_KEY] as TotpLoginContext | undefined;
