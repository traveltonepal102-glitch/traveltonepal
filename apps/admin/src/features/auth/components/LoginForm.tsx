"use client";

import Image from "next/image";
import type { FormEvent } from "react";

import { AuthHeading } from "./AuthHeading";
import { CredentialsForm } from "./CredentialsForm";

// Sign-in is not connected yet (design only): submitting stays on the page and sends nothing.
const ignoreSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

/** Sign-in content: logo, heading and the email and password form. */
export const LoginForm = () => (
  <>
    <div className="flex flex-col gap-3.5">
      <Image src="/brand/logo.svg" alt="Travel To Nepal" width={75} height={44} className="h-11 w-auto self-start" preload />
      <AuthHeading title="Sign in" description="For the Travel To Nepal team only." />
    </div>
    <CredentialsForm onSubmit={ignoreSubmit} />
  </>
);
